import { FireFlySubscriptionBase } from '@photic/firefly-sdk-nodejs';
import { nanoid } from 'nanoid';
import {
  Controller,
  Post,
  Get,
  HttpCode,
  ContentType,
  UploadedFile,
  Req,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Request } from 'express';
import { firefly } from '../clients/firefly';
import { formatTemplate, WebsocketHandler, quoteAndEscape as q } from '../utils';

@Controller('/simple')
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
  @ContentType('application/json')
  @HttpCode(202)
  @OpenAPI({
    summary: 'Send a FireFly broadcast message',
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: { $ref: '#/components/schemas/BroadcastRequest' },
        },
      },
    },
  })
  async broadcast(@Req() req: Request, @UploadedFile('file') file: Express.Multer.File) {
    console.log('Sending broadcast message');
    const data =
      file !== undefined
        ? await firefly.uploadDataBlob(file.buffer, file.originalname)
        : { value: req.body.value };
    return firefly.sendBroadcast({
      header: {
        tag: req.body.tag || undefined,
        topics: req.body.topic ? [req.body.topic] : undefined,
      },
      data: [data],
    });
  }

  // Templated code for the above method
  @Get('/template/broadcast')
  @ContentType('application/json')
  broadcastTemplate() {
    return formatTemplate(`
      const data = <%= filename
        ? 'await firefly.uploadDataBlob(file.buffer, ' + ${q('filename')} + ')'
        : '{ value: ' + ${q('value')} + ' }' %>;
      return firefly.sendBroadcast({
        header: {
          tag: <%= tag ? ${q('tag')} : 'undefined' %>,
          topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
        }
        data: [data],
      });
    `);
  }
}

export default SimpleController;
