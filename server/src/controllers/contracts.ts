import {
  Post,
  HttpCode,
  Body,
  JsonController,
  Get,
  Param,
  NotFoundError,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { firefly } from '../clients/firefly';
import { formatTemplate, quoteAndEscape as q } from '../utils';
import {
  AsyncResponse,
  ContractAPI,
  ContractAPILookup,
  ContractInterface,
  ContractInterfaceFormat,
} from '../interfaces';

/**
 * Smart Contracts - API Server
 */
@JsonController('/contracts')
@OpenAPI({ tags: ['Smart Contracts'] })
export class ContractsController {
  @Post('/interface')
  @HttpCode(202)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({
    summary: 'Define a new contract interface',
    description:
      'Schema may be in <a href="https://hyperledger.github.io/firefly/reference/firefly_interface_format">FFI</a> ' +
      'or <a href="https://docs.ethers.io/v5/api/utils/abi/formats/#abi-formats--solidity">Solidity JSON ABI</a> format. ',
  })
  async createInterface(@Body() body: ContractInterface): Promise<AsyncResponse> {
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
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Define a new contract API' })
  async createAPI(@Body() body: ContractAPI): Promise<AsyncResponse> {
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

  @Get('/api/:name')
  @ResponseSchema(ContractAPILookup)
  @OpenAPI({ summary: 'Get contract API details' })
  async getAPI(@Param('name') name: string): Promise<ContractAPILookup> {
    const api = await firefly.getContractAPI(name);
    if (api === undefined) {
      throw new NotFoundError();
    }
    return {
      name: api.name,
      urls: { openapi: api.urls?.openapi, ui: api.urls?.ui },
    };
  }
}

/**
 * Smart Contracts - Code Templates
 * Allows the frontend to display representative code snippets for backend operations.
 * For demonstration purposes only.
 */
@JsonController('/contracts/template')
@OpenAPI({ tags: ['Smart Contracts'] })
export class ContractsTemplateController {
  @Get('/interface')
  interfaceTemplate() {
    return formatTemplate(`
      const ffi = <%= format === 'abi' ?
      \`await firefly.generateContractInterface({
        name: \` + ${q('name')} + \`,
        version: \` + ${q('version')} + \`,
        input: \` + ${q('schema', { noQuote: true, truncate: true })} + \`,
      })\` : ${q('schema', { noQuote: true, truncate: true })} %>;
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
        location: {
          address: <%= ${q('address')} %>,
        },
      });
      return { type: 'message', id: api.message };
    `);
  }
}
