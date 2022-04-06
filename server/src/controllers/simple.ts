import { FireFlySubscriptionBase } from '@photic/firefly-sdk-nodejs';
import { nanoid } from 'nanoid';
import { Post, Get, HttpCode, UploadedFile, Req, Body, JsonController } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Request } from 'express';
import { firefly } from '../clients/firefly';
import { formatTemplate, WebsocketHandler, quoteAndEscape as q, FormDataSchema } from '../utils';
import {
  BroadcastBlob,
  BroadcastValue,
  Organization,
  MessageResponse,
  SendValue,
} from '../interfaces';

@JsonController('/simple')
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

  @Get('/organizations')
  @ResponseSchema(Organization, { isArray: true })
  @OpenAPI({ summary: 'List all organizations in network' })
  async organizations(): Promise<Organization[]> {
    const orgs = await firefly.getOrganizations();
    return orgs.map((o) => ({ id: o.id, did: o.did, name: o.name }));
  }

  @Post('/private')
  @HttpCode(202)
  @ResponseSchema(MessageResponse)
  @OpenAPI({ summary: 'Send a FireFly private message with an inline value' })
  async send(@Body() body: SendValue): Promise<MessageResponse> {
    // See SimpleTemplateController and keep template code up to date.
    const message = await firefly.sendPrivateMessage({
      header: {
        tag: body.tag || undefined,
        topics: body.topic ? [body.topic] : undefined,
      },
      group: {
        members: body.recipients.map((r) => ({ identity: r })),
      },
      data: [{ value: body.value }],
    });
    return { id: message.header.id };
  }
}

/**
 * Code Templates
 * Allows the frontend to display representative code snippets for backend operations.
 * For demonstration purposes only.
 */
@JsonController('/simple/template')
@OpenAPI({ tags: ['Simple Operations'] })
export class SimpleTemplateController {
  static init() {
    // do nothing
  }

  @Get('/broadcast')
  broadcastTemplate() {
    return formatTemplate(`
      const message = await firefly.sendBroadcast({
        header: {
          tag: <%= tag ? ${q('tag')} : 'undefined' %>,
          topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
        },
        data: [{ value: <%= ${q('value')} %> }],
      });
    `);
  }

  @Get('/broadcastblob')
  broadcastBlobTemplate() {
    return formatTemplate(`
      const data = await firefly.uploadDataBlob(file.buffer, <%= ${q('filename')} %>);
      const message = await firefly.sendBroadcast({
        header: {
          tag: <%= tag ? ${q('tag')} : 'undefined' %>,
          topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
        },
        data: [{ id: data.id }],
      });
    `);
  }

  @Get('/private')
  privateTemplate() {
    return formatTemplate(`
      const message = await firefly.sendPrivateMessage({
        header: {
          tag: <%= tag ? ${q('tag')} : 'undefined' %>,
          topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
        },
        group: {
          members: [<%= recipients.map((r) => '{identity: ' + ${q('r')} + '}').join(', ') %>],
        },
        data: [{ value: <%= ${q('value')} %> }],
      });
    `);
  }
}
