import * as http from 'http';
import { Duplex } from 'stream';
import { getMetadataArgsStorage, RoutingControllersOptions } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { WebSocketServer } from 'ws';

export function genOpenAPI(options: RoutingControllersOptions) {
  return routingControllersToSpec(getMetadataArgsStorage(), options, {
    info: {
      title: 'FireFly Samples Gallery - Backend Server',
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
