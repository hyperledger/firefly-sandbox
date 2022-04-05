import { FireFlySubscriptionBase } from '@photic/firefly-sdk-nodejs';
import { nanoid } from 'nanoid';
import { JsonController, Body, Post, Get, HttpCode } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { firefly } from '../clients/firefly';
import { BroadcastRequest } from '../interfaces';
import { formatTemplate, WebsocketHandler, quoteAndEscape as q } from '../utils';

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
        tag: body.tag || undefined,
        topics: body.topic ? [body.topic] : undefined,
      },
      data: [{ value: body.value }],
    });
  }

  // Templated code for the above method
  @Get('/template/broadcast')
  broadcastTemplate() {
    return formatTemplate(`
      return firefly.sendBroadcast({
        header: {
          tag: <%= tag ? ${q('tag')} : 'undefined' %>,
          topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
        }
        data: [{ value: <%= ${q('value')} %> }],
      });
    `);
  }
}

export default SimpleController;
