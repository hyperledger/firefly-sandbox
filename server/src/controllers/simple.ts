import { FireFlySubscriptionBase } from '@photic/firefly-sdk-nodejs';
import { nanoid } from 'nanoid';
import { JsonController, Body, Post, Get, HttpCode } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { firefly } from '../clients/firefly';
import { BroadcastRequest } from '../interfaces';
import { WebsocketHandler } from '../utils';

@JsonController('/simple')
@OpenAPI({ tags: ['Simple Operations'] })
class SimpleController {
  static init(wsHandler: WebsocketHandler) {
    const wss = wsHandler.addWebsocket('/api/simple/ws');
    wss.on('connection', (client, request) => {
      const id = nanoid();
      console.log(`Connecting websocket client ${id}`);

      const url = new URL(request.url ?? '', `http://${request.headers.host}`);
      const sub: FireFlySubscriptionBase = {
        filter: {
          events: url.searchParams.get('filter.events') ?? undefined,
        },
      };
      const ffSocket = firefly.listen(sub, (socket, data) => {
        client.send(JSON.stringify(data));
      });
      client.on('close', () => {
        console.log(`Disconnecting websocket client ${id}`);
        ffSocket.close();
      });
    });
  }

  @Post('/broadcast')
  @HttpCode(202)
  @OpenAPI({ summary: 'Send a FireFly broadcast message' })
  broadcast(@Body() body: BroadcastRequest) {
    console.log('Sending broadcast message');
    return firefly.sendBroadcast({
      header: {
        tag: body.tag ?? '',
        topics: body.topic !== undefined ? [body.topic] : undefined,
      },
      data: [{ value: body.value }],
    });
  }
}

export default SimpleController;
