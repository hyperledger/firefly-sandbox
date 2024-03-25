import {
  Post,
  HttpCode,
  Body,
  JsonController,
  Get,
  Param,
  NotFoundError,
  QueryParam,
} from 'routing-controllers';
import { getFireflyClient } from '../clients/fireflySDKWrapper';
import { formatTemplate, quoteAndEscape as q } from '../utils';
import {
  AsyncResponse,
  ContractAPI,
  ContractAPILookup,
  ContractInterface,
  ContractInterfaceFormat,
  ContractInterfaceLookup,
  ContractListener,
  ContractListenerLookup,
} from '../interfaces';

/**
 * Smart Contracts - API Server
 */
@JsonController('/contracts')
export class ContractsController {
  @Post('/interface')
  @HttpCode(202)
  async createInterface(
    @Body() body: ContractInterface,
    @QueryParam('ns') namespace: string,
  ): Promise<AsyncResponse> {
    const firefly = getFireflyClient(namespace);
    // See ContractsTemplateController and keep template code up to date.
    const ffi =
      body.format === ContractInterfaceFormat.ABI
        ? await firefly.generateContractInterface({
            name: body.name,
            version: body.version,
            input: { abi: body.schema },
          })
        : body.schema;
    const result = await firefly.createContractInterface(ffi);
    return { type: 'message', id: result.message };
  }

  @Post('/api')
  @HttpCode(202)
  async createAPI(
    @Body() body: ContractAPI,
    @QueryParam('ns') namespace: string,
  ): Promise<AsyncResponse> {
    const firefly = getFireflyClient(namespace);
    // See ContractsTemplateController and keep template code up to date.
    const api = await firefly.createContractAPI({
      name: body.name,
      interface: {
        name: body.interfaceName,
        version: body.interfaceVersion,
      },
      location: {
        address: body.address,
      },
    });
    return { type: 'message', id: api.message };
  }

  @Post('/apifabric')
  @HttpCode(202)
  async createAPIFabric(
    @Body() body: ContractAPI,
    @QueryParam('ns') namespace: string,
  ): Promise<AsyncResponse> {
    const firefly = getFireflyClient(namespace);
    // See ContractsTemplateController and keep template code up to date.
    const api = await firefly.createContractAPI({
      name: body.name,
      interface: {
        name: body.interfaceName,
        version: body.interfaceVersion,
      },
      location: {
        chaincode: body.chaincode,
        channel: body.channel,
      },
    });
    return { type: 'message', id: api.message };
  }

  @Get('/interface')
  async getContractInterfaces(
    @QueryParam('ns') namespace: string,
  ): Promise<ContractInterfaceLookup[]> {
    const firefly = getFireflyClient(namespace);
    const interfaces = await firefly.getContractInterfaces();
    return interfaces;
  }

  @Get('/api')
  async getAPIs(@QueryParam('ns') namespace: string): Promise<ContractAPILookup[]> {
    const firefly = getFireflyClient(namespace);
    const apis = await firefly.getContractAPIs();
    return apis.map((api) => ({
      name: api.name,
      address: api.location?.address,
      urls: api.urls,
    }));
  }

  @Get('/api/:name')
  async getAPI(
    @Param('name') name: string,
    @QueryParam('ns') namespace: string,
  ): Promise<ContractAPILookup> {
    const firefly = getFireflyClient(namespace);
    const api = await firefly.getContractAPI(name);
    if (api === undefined) {
      throw new NotFoundError();
    }
    const ffi = await firefly.getContractInterface(api.interface.id, true);
    return {
      name: api.name,
      address: api.location?.address,
      urls: api.urls,
      events: ffi.events?.map((e) => ({ pathname: e.pathname })),
    };
  }

  @Get('/api/:name/listener')
  async getAPIListeners(
    @Param('name') name: string,
    @QueryParam('ns') namespace: string,
  ): Promise<ContractListenerLookup[]> {
    const firefly = getFireflyClient(namespace);
    const api = await firefly.getContractAPI(name);
    const listeners = await firefly.getContractListeners({
      interface: api.interface.id,
      location: api.location,
    });
    return listeners.map((l) => ({
      id: l.id,
      name: l.name,
      topic: l.topic,
      address: l.location?.address,
      eventName: l.event.name,
    }));
  }

  @Post('/listener')
  async createListener(
    @Body() body: ContractListener,
    @QueryParam('ns') namespace: string,
  ): Promise<ContractListenerLookup> {
    const firefly = getFireflyClient(namespace);
    // See ContractsTemplateController and keep template code up to date.
    const listener = await firefly.createContractAPIListener(body.apiName, body.eventPath, {
      topic: body.topic,
      name: body.name,
      options: {
        firstEvent: body.firstEvent,
      },
    });
    return {
      id: listener.id,
      name: listener.name,
      topic: listener.topic,
      address: listener.location,
      eventName: listener.event.name,
    };
  }
}

/**
 * Smart Contracts - Code Templates
 * Allows the frontend to display representative code snippets for backend operations.
 * For demonstration purposes only.
 */
@JsonController('/contracts/template')
export class ContractsTemplateController {
  @Get('/interface')
  interfaceTemplate() {
    return formatTemplate(`
      const ffi = <% if (format === 'abi') { %>await firefly.generateContractInterface({
        name: <%= ${q('name')} %>,
        version: <%= ${q('version')} %>,
        input: {
          abi: <%= ${q('schema', { isObject: true, truncate: true })} %>,
        },
      })<% } else { %><%= ${q('schema', { isObject: true, truncate: true })} %><% } %>;
      const result = await firefly.createContractInterface(ffi);
      return { type: 'message', id: result.message };
    `);
  }

  @Get('/api')
  apiTemplate() {
    return formatTemplate(`
      const api = await firefly.createContractAPI({
        name: <%= ${q('name')} %>,
        interface: {
          name: <%= ${q('interfaceName')} %>,
          version: <%= ${q('interfaceVersion')} %>,
        },
        location: {<% if (address) { %>
          address: <%= ${q('address')} %>,<% } else { %>
          chaincode: <%= ${q('chaincode')} %>,
          channel: <%= ${q('channel')} %>,<% } %>
        },
      });
      return { type: 'message', id: api.message };
    `);
  }

  @Get('/listener')
  listenerTemplate() {
    return formatTemplate(`
      const listener = await firefly.createContractAPIListener(
        <%= ${q('apiName')} %>,
        <%= ${q('eventPath')} %>,
        {
          topic: <%= ${q('topic')} %>,<% if (name) { %>
          <% print('name: ' + ${q('name')} + ',') } %>
          options: {<% if (firstEvent) { %>
            <% print('firstEvent: ' + ${q('firstEvent')} + ',') } %>
          }
        },
      );
      return {
        name: listener.name,
        topic: listener.topic,
        address: listener.location.address,
      };
    `);
  }
}
