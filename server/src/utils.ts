import * as http from 'http';
import { Duplex } from 'stream';
import { getMetadataArgsStorage, RoutingControllersOptions } from 'routing-controllers';
import { OpenAPI, routingControllersToSpec } from 'routing-controllers-openapi';
import { WebSocketServer } from 'ws';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import stripIndent = require('strip-indent');

export function genOpenAPI(options: RoutingControllersOptions) {
  return routingControllersToSpec(getMetadataArgsStorage(), options, {
    info: {
      title: 'FireFly Sandbox - Backend Server',
      version: '1.0.0',
    },
    components: {
      schemas: validationMetadatasToSchemas({ refPointerPrefix: '#/components/schemas/' }),
    },
  });
}

export class WebsocketHandler {
  websockets = new Map<string, WebSocketServer>();

  addWebsocket(path: string) {
    const wss = new WebSocketServer({ noServer: true });
    this.websockets.set(path, wss);
    return wss;
  }

  handleUpgrade(request: http.IncomingMessage, socket: Duplex, head: Buffer) {
    const url = new URL(request.url ?? '', `http://${request.headers.host}`);
    const wss = this.websockets.get(url.pathname);
    if (wss === undefined) {
      return false;
    }
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
    return true;
  }
}

// Decorator for annotating a request that takes in a body of type multipart/form-data
export function FormDataSchema(schemaClass: any) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    OpenAPI({
      requestBody: {
        content: {
          'multipart/form-data': {
            schema: { $ref: '#/components/schemas/' + schemaClass.name },
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
}

export function formatTemplate(template: string) {
  return stripIndent(template).trim();
}

export interface QuoteOptions {
  isObject?: boolean;
  truncate?: boolean;
}

export function quoteAndEscape(varName: string, options?: QuoteOptions) {
  if (options?.isObject) {
    varName = `JSON.stringify(${varName})`;
  } else {
    varName = `new String(${varName})`;
  }
  if (options?.truncate) {
    const maxLength = 20;
    const halfLength = maxLength / 2;
    varName = `(${varName}.length > ${maxLength}
      ? ${varName}.substring(0, ${halfLength}) + ' ... ' + ${varName}.substring(${varName}.length - ${halfLength})
      : ${varName})`;
  }
  if (!options?.isObject) {
    varName = `"'" + ${varName}.replaceAll("'", "\\\\'") + "'"`;
  }
  return varName;
}

export function getBroadcastMessageBody(body: any, blobId?: string) {
  const dataBody = blobId ? { id: blobId } : getMessageBody(body);
  return {
    header: {
      tag: body.tag || undefined,
      topics: body.topic ? [body.topic] : undefined,
    },
    data: [dataBody],
  };
}

export function getPrivateMessageBody(body: any, blobId?: string) {
  const dataBody = blobId ? { id: blobId } : getMessageBody(body);
  return {
    header: {
      tag: body.tag || undefined,
      topics: body.topic ? [body.topic] : undefined,
      type: 'transfer_private',
    },
    group: {
      members: body.recipients.map((r) => ({ identity: r })),
    },
    data: [dataBody],
  };
}

export function getMessageBody(body: any) {
  const dataBody = {} as any;
  dataBody.value = body.value || body.jsonValue;
  if (body.jsonValue && body.datatypename && body.datatypeversion) {
    dataBody.datatype = {
      name: body.datatypename,
      version: body.datatypeversion,
    };
  }
  return dataBody;
}
