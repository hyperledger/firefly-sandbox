import { FireFlySubscriptionBase } from '@photic/firefly-sdk-nodejs';
import { nanoid } from 'nanoid';
import {
  Post,
  Get,
  HttpCode,
  UploadedFile,
  Req,
  Body,
  JsonController,
  BadRequestError,
  QueryParam,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Request } from 'express';
import { firefly } from '../clients/firefly';
import { formatTemplate, WebsocketHandler, quoteAndEscape as q, FormDataSchema } from '../utils';
import {
  BroadcastBlob,
  BroadcastValue,
  Organization,
  FireFlyResponse,
  PrivateValue,
  PrivateBlob,
  TokenPool,
  TokenPoolInput,
} from '../interfaces';
import { plainToClassFromExist } from 'class-transformer';

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
  @ResponseSchema(FireFlyResponse)
  @OpenAPI({ summary: 'Send a FireFly broadcast with an inline value' })
  async broadcast(@Body() body: BroadcastValue): Promise<FireFlyResponse> {
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
  @ResponseSchema(FireFlyResponse)
  @OpenAPI({ summary: 'Send a FireFly broadcast with a binary blob' })
  async broadcastblob(
    @Req() req: Request,
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<FireFlyResponse> {
    // See SimpleTemplateController and keep template code up to date.
    const body = plainToClassFromExist(new BroadcastBlob(), req.body);
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
  async organizations(@QueryParam('exclude_self') exclude_self: boolean): Promise<Organization[]> {
    let orgs = await firefly.getOrganizations();
    if (exclude_self) {
      const status = await firefly.getStatus();
      orgs = orgs.filter((o) => o.id !== status.org.id);
    }
    return orgs.map((o) => ({ id: o.id, did: o.did, name: o.name }));
  }

  @Post('/private')
  @HttpCode(202)
  @ResponseSchema(FireFlyResponse)
  @OpenAPI({ summary: 'Send a FireFly private message with an inline value' })
  async send(@Body() body: PrivateValue): Promise<FireFlyResponse> {
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

  @Post('/privateblob')
  @HttpCode(202)
  @FormDataSchema(PrivateBlob)
  @ResponseSchema(FireFlyResponse)
  @OpenAPI({ summary: 'Send a FireFly private message with a binary blob' })
  async sendblob(
    @Req() req: Request,
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<FireFlyResponse> {
    // See SimpleTemplateController and keep template code up to date.
    const body = plainToClassFromExist(new PrivateBlob(), req.body);
    const data = await firefly.uploadDataBlob(file.buffer, file.originalname);
    const message = await firefly.sendPrivateMessage({
      header: {
        tag: body.tag || undefined,
        topics: body.topic ? [body.topic] : undefined,
      },
      group: {
        members: body.recipients.map((r) => ({ identity: r })),
      },
      data: [{ id: data.id }],
    });
    return { id: message.header.id };
  }

  @Get('/tokenpools')
  @ResponseSchema(TokenPool, { isArray: true })
  @OpenAPI({ summary: 'List all token pools' })
  async tokenpools(): Promise<TokenPool[]> {
    const pools = await firefly.getTokenPools();
    return pools.map((p) => ({ id: p.id, name: p.name, symbol: p.symbol, type: p.type }));
  }

  @Post('/tokenpools')
  @HttpCode(202)
  @ResponseSchema(FireFlyResponse)
  @OpenAPI({ summary: 'Create a token pool' })
  async createtokenpool(@Body() body: TokenPoolInput): Promise<FireFlyResponse> {
    // See SimpleTemplateController and keep template code up to date.
    const pool = await firefly.createTokenPool({
      name: body.name,
      symbol: body.symbol,
      type: body.type,
    });
    return { id: pool.id };
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
  broadcastblobTemplate() {
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
  sendTemplate() {
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

  @Get('/privateblob')
  sendblobTemplate() {
    return formatTemplate(`
      const data = await firefly.uploadDataBlob(file.buffer, <%= ${q('filename')} %>);
      const message = await firefly.sendPrivateMessage({
        header: {
          tag: <%= tag ? ${q('tag')} : 'undefined' %>,
          topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
        },
        group: {
          members: [<%= recipients.map((r) => '{identity: ' + ${q('r')} + '}').join(', ') %>],
        },
        data: [{ id: data.id }],
      });
    `);
  }

  @Get('/tokenpools')
  tokenpoolsTemplate() {
    return formatTemplate(`
      const pool = await firefly.createTokenPool({
        name: <%= ${q('name')} %>,
        symbol: <%= ${q('symbol')} %>,
        type: <%= ${q('type')} %>,
      });
    `);
  }
}
