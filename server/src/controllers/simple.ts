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
  Body,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Request } from 'express';
import { firefly } from '../clients/firefly';
import { formatTemplate, WebsocketHandler, quoteAndEscape as q, FormDataSchema } from '../utils';
import { BroadcastBlob, BroadcastValue, MessageResponse } from '../interfaces';

@Controller('/simple')
@OpenAPI({ tags: ['Simple Operations'] })
export class SimpleController {
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
  @ResponseSchema(MessageResponse)
  @OpenAPI({ summary: 'Send a FireFly broadcast with an inline value' })
  async broadcast(@Body() body: BroadcastValue): Promise<MessageResponse> {
    // See SimpleTemplateController and keep template code up to date.
    const message = await firefly.sendBroadcast({
      header: {
        tag: body.tag || undefined,
        topics: body.topic ? [body.topic] : undefined,
      },
      data: [{ value: body.value }],
    });
    return { id: message.header.id };
  }

  @Post('/broadcastblob')
  @ContentType('application/json')
  @HttpCode(202)
  @FormDataSchema(BroadcastBlob)
  @ResponseSchema(MessageResponse)
  @OpenAPI({ summary: 'Send a FireFly broadcast with a binary blob' })
  async broadcastblob(
    @Req() req: Request,
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<MessageResponse> {
    // See SimpleTemplateController and keep template code up to date.
    const body: BroadcastBlob = req.body;
    const data = await firefly.uploadDataBlob(file.buffer, file.originalname);
    const message = await firefly.sendBroadcast({
      header: {
        tag: body.tag || undefined,
        topics: body.topic ? [body.topic] : undefined,
      },
      data: [{ id: data.id }],
    });
    return { id: message.header.id };
  }
}

/**
 * Code Templates
 * Allows the frontend to display representative code snippets for backend operations.
 * For demonstration purposes only.
 */
@Controller('/simple/template')
@OpenAPI({ tags: ['Simple Operations'] })
export class SimpleTemplateController {
  static init() {
    // do nothing
  }

  @Get('/broadcast')
  @ContentType('application/json')
  broadcastTemplate() {
    return formatTemplate(`
      const message = await firefly.sendBroadcast({
        header: {
          tag: <%= tag ? ${q('tag')} : 'undefined' %>,
          topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
        }
        data: [{ value: <%= ${q('value')} %> }],
      });
    `);
  }

  @Get('/broadcastblob')
  @ContentType('application/json')
  broadcastBlobTemplate() {
    return formatTemplate(`
      const data = await firefly.uploadDataBlob(file.buffer, <%= ${q('filename')} %>);
      const message = await firefly.sendBroadcast({
        header: {
          tag: <%= tag ? ${q('tag')} : 'undefined' %>,
          topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
        }
        data: [{ id: data.id }],
      });
    `);
  }
}
