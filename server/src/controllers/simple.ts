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
  QueryParam,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Request } from 'express';
import { plainToClassFromExist } from 'class-transformer';
import { firefly } from '../clients/firefly';
import { formatTemplate, WebsocketHandler, quoteAndEscape as q, FormDataSchema } from '../utils';
import {
  BroadcastBlob,
  BroadcastValue,
  Organization,
  PrivateValue,
  PrivateBlob,
  TokenPool,
  TokenPoolInput,
  TokenMint,
  TokenTransfer,
  TokenBurn,
  Verifier,
  TokenBalance,
  AsyncResponse,
} from '../interfaces';
import Logger from '../logger';

/**
 * Simple Operations - WebSocket Server
 */
export class SimpleWebSocket {
  logger = new Logger(SimpleWebSocket.name);
  path = '/simple/ws';

  init(prefix: string, wsHandler: WebsocketHandler) {
    wsHandler.addWebsocket(prefix + this.path).on('connection', (client, request) => {
      // Each time a client connects to this server, open a corresponding connection to FireFly
      const id = nanoid();
      this.logger.log(`Connecting websocket client ${id}`);
      const url = new URL(request.url ?? '', `http://${request.headers.host}`);
      const sub: FireFlySubscriptionBase = {
        filter: {
          events: url.searchParams.get('filter.events') ?? undefined,
        },
      };

      const ffSocket = firefly.listen(sub, async (socket, event) => {
        if (event.type === 'transaction_submitted' && event.transaction?.type === 'batch_pin') {
          // Enrich batch_pin transaction events with details on the batch
          const batches = await firefly.getBatches({ 'tx.id': event.tx });
          event['batch'] = batches[0];
        }

        // Forward the event to the client
        client.send(JSON.stringify(event));
      });

      client.on('close', () => {
        this.logger.log(`Disconnecting websocket client ${id}`);
        ffSocket.close();
      });
    });
  }
}

/**
 * Simple Operations - API Server
 */
@JsonController('/simple')
@OpenAPI({ tags: ['Simple Operations'] })
export class SimpleController {
  @Post('/broadcast')
  @HttpCode(202)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Send a FireFly broadcast with an inline value' })
  async broadcast(@Body() body: BroadcastValue): Promise<AsyncResponse> {
    // See SimpleTemplateController and keep template code up to date.
    const message = await firefly.sendBroadcast({
      header: {
        tag: body.tag || undefined,
        topics: body.topic ? [body.topic] : undefined,
      },
      data: [{ value: body.value }],
    });
    return { type: 'message', id: message.header.id };
  }

  @Post('/broadcastblob')
  @HttpCode(202)
  @FormDataSchema(BroadcastBlob)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Send a FireFly broadcast with a binary blob' })
  async broadcastblob(
    @Req() req: Request,
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<AsyncResponse> {
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
    return { type: 'message', id: message.header.id };
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

  @Get('/organizations/self')
  @ResponseSchema(Organization)
  @OpenAPI({ summary: 'Look up local organization' })
  async self(): Promise<Organization> {
    const status = await firefly.getStatus();
    return { id: status.org.id, did: status.org.did, name: status.org.name };
  }

  @Get('/verifiers')
  @ResponseSchema(Verifier, { isArray: true })
  @OpenAPI({ summary: 'List verifiers (such as Ethereum keys) for all organizations in network' })
  async verifiers(): Promise<Verifier[]> {
    const orgs = await firefly.getOrganizations();
    const verifiers = await firefly.getVerifiers('ff_system');
    const result: Verifier[] = [];
    for (const v of verifiers) {
      const o = orgs.find((o) => o.id === v.identity);
      if (o !== undefined) {
        result.push({ did: o.did, type: v.type, value: v.value });
      }
    }
    return result;
  }

  @Post('/private')
  @HttpCode(202)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Send a FireFly private message with an inline value' })
  async send(@Body() body: PrivateValue): Promise<AsyncResponse> {
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
    return { type: 'message', id: message.header.id };
  }

  @Post('/privateblob')
  @HttpCode(202)
  @FormDataSchema(PrivateBlob)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Send a FireFly private message with a binary blob' })
  async sendblob(
    @Req() req: Request,
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<AsyncResponse> {
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
    return { type: 'message', id: message.header.id };
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
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Create a token pool' })
  async createtokenpool(@Body() body: TokenPoolInput): Promise<AsyncResponse> {
    // See SimpleTemplateController and keep template code up to date.
    const pool = await firefly.createTokenPool({
      name: body.name,
      symbol: body.symbol,
      type: body.type,
    });
    return { type: 'message', id: pool.message };
  }

  @Post('/mint')
  @HttpCode(202)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Mint tokens within a token pool' })
  async mint(@Body() body: TokenMint): Promise<AsyncResponse> {
    // See SimpleTemplateController and keep template code up to date.
    const transfer = await firefly.mintTokens({
      pool: body.pool,
      amount: body.amount,
    });
    return { type: 'token_transfer', id: transfer.localId };
  }

  @Post('/burn')
  @HttpCode(202)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Burn tokens within a token pool' })
  async burn(@Body() body: TokenBurn): Promise<AsyncResponse> {
    // See SimpleTemplateController and keep template code up to date.
    const transfer = await firefly.burnTokens({
      pool: body.pool,
      amount: body.amount,
      tokenIndex: body.tokenIndex,
    });
    return { type: 'token_transfer', id: transfer.localId };
  }

  @Post('/transfer')
  @HttpCode(202)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Transfer tokens within a token pool' })
  async transfer(@Body() body: TokenTransfer): Promise<AsyncResponse> {
    // See SimpleTemplateController and keep template code up to date.
    const transfer = await firefly.transferTokens({
      pool: body.pool,
      to: body.to,
      amount: body.amount,
      tokenIndex: body.tokenIndex,
    });
    return { type: 'token_transfer', id: transfer.localId };
  }

  @Get('/balances')
  @ResponseSchema(TokenBalance, { isArray: true })
  @OpenAPI({ summary: 'Query token balances' })
  async balances(
    @QueryParam('pool') pool: string,
    @QueryParam('key') key: string,
  ): Promise<TokenBalance[]> {
    const balances = await firefly.getTokenBalances({ pool, key, balance: '>0' });
    return balances.map((b) => ({
      pool: b.pool,
      key: b.key,
      balance: b.balance,
      tokenIndex: b.tokenIndex,
    }));
  }
}

/**
 * Simple Operations - Code Templates
 * Allows the frontend to display representative code snippets for backend operations.
 * For demonstration purposes only.
 */
@JsonController('/simple/template')
@OpenAPI({ tags: ['Simple Operations'] })
export class SimpleTemplateController {
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
      return { type: 'message', id: message.header.id };
    `);
  }

  @Get('/broadcastblob')
  broadcastblobTemplate() {
    return formatTemplate(`
      const data = await firefly.uploadDataBlob(
        file.buffer,
        <%= ${q('filename')} %>,
      );
      const message = await firefly.sendBroadcast({
        header: {
          tag: <%= tag ? ${q('tag')} : 'undefined' %>,
          topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
        },
        data: [{ id: data.id }],
      });
      return { type: 'message', id: message.header.id };
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
          members: [<%= recipients.map((r) => '{ identity: ' + ${q('r')} + ' }').join(', ') %>],
        },
        data: [{ value: <%= ${q('value')} %> }],
      });
      return { type: 'message', id: message.header.id };
    `);
  }

  @Get('/privateblob')
  sendblobTemplate() {
    return formatTemplate(`
      const data = await firefly.uploadDataBlob(
        file.buffer,
        <%= ${q('filename')} %>,
      );
      const message = await firefly.sendPrivateMessage({
        header: {
          tag: <%= tag ? ${q('tag')} : 'undefined' %>,
          topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
        },
        group: {
          members: [<%= recipients.map((r) => '{ identity: ' + ${q('r')} + ' }').join(', ') %>],
        },
        data: [{ id: data.id }],
      });
      return { type: 'message', id: message.header.id };
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
      return { type: 'message', id: pool.message };
    `);
  }

  @Get('/mint')
  mintTemplate() {
    return formatTemplate(`
      const transfer = await firefly.mintTokens({
        pool: <%= ${q('pool')} %>,
        amount: <%= ${q('amount')} %>,
      });
      return { type: 'token_transfer', id: transfer.localId };
    `);
  }

  @Get('/burn')
  burnTemplate() {
    return formatTemplate(`
      const transfer = await firefly.burnTokens({
        pool: <%= ${q('pool')} %>,
        amount: <%= ${q('amount')} %>,
        tokenIndex: <%= tokenIndex ? ${q('tokenIndex')} : 'undefined' %>,
      });
      return { type: 'token_transfer', id: transfer.localId };
    `);
  }

  @Get('/transfer')
  transferTemplate() {
    return formatTemplate(`
      const transfer = await firefly.transferTokens({
        pool: <%= ${q('pool')} %>,
        to: <%= ${q('to')} %>,
        amount: <%= ${q('amount')} %>,
        tokenIndex: <%= tokenIndex ? ${q('tokenIndex')} : 'undefined' %>,
      });
      return { type: 'token_transfer', id: transfer.localId };
    `);
  }

  @Get('/balances')
  balancesTemplate() {
    return formatTemplate(`
      const balances = await firefly.getTokenBalances({
        pool: <%= pool ? ${q('pool')} : 'undefined' %>,
        key: <%= key ? ${q('key')} : 'undefined' %>,
        balance: '>0',
      });
      return balances.map((b) => ({
        pool: b.pool,
        key: b.key,
        balance: b.balance,
        tokenIndex: b.tokenIndex,
      }));
    `);
  }
}
