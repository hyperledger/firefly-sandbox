import {
  Post,
  Get,
  HttpCode,
  Body,
  JsonController,
  QueryParam,
  Req,
  UploadedFile,
  Param,
} from 'routing-controllers';
import { Request } from 'express';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { plainToClassFromExist } from 'class-transformer';
import { getFireflyClient } from '../clients/fireflySDKWrapper';
import {
  FF_MESSAGES,
  formatTemplate,
  FormDataSchema,
  getBroadcastMessageBody,
  getPrivateMessageBody,
  mapPool,
  quoteAndEscape as q,
} from '../utils';
import {
  TokenPool,
  TokenPoolInput,
  TokenMintBurn,
  TokenTransfer,
  TokenBalance,
  AsyncResponse,
  MintBurnBlob,
  TransferBlob,
} from '../interfaces';

/**
 * Tokens - API Server
 */
@JsonController('/tokens')
@OpenAPI({ tags: ['Tokens'] })
export class TokensController {
  @Get('/pools')
  @ResponseSchema(TokenPool, { isArray: true })
  @OpenAPI({ summary: 'List all token pools' })
  async tokenpools(@QueryParam('ns') namespace: string): Promise<TokenPool[]> {
    const firefly = getFireflyClient(namespace);
    const pools = await firefly.getTokenPools();
    return pools.map((p) => mapPool(p));
  }

  @Get('/pools/:id')
  @ResponseSchema(TokenPool)
  @OpenAPI({ summary: 'Look up a token pool by ID' })
  async tokenpool(
    @Param('id') id: string,
    @QueryParam('ns') namespace: string,
  ): Promise<TokenPool> {
    const firefly = getFireflyClient(namespace);
    const pool = await firefly.getTokenPool(id);
    return mapPool(pool);
  }

  @Post('/pools')
  @HttpCode(202)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Create a token pool' })
  async createtokenpool(
    @Body() body: TokenPoolInput,
    @QueryParam('ns') namespace: string,
  ): Promise<AsyncResponse> {
    const firefly = getFireflyClient(namespace);
    // See TokensTemplateController and keep template code up to date.
    const pool = await firefly.createTokenPool({
      name: body.name,
      symbol: body.symbol,
      type: body.type,
      interface: {
        id: body.contractInterface,
      },
      config: {
        address: body.address,
        blockNumber: body.blockNumber,
      },
    });
    return { type: 'token_pool', id: pool.id };
  }

  @Post('/mint')
  @HttpCode(202)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Mint tokens within a token pool' })
  async mint(
    @Body() body: TokenMintBurn,
    @QueryParam('ns') namespace: string,
  ): Promise<AsyncResponse> {
    const firefly = getFireflyClient(namespace);
    // See TokensTemplateController and keep template code up to date.
    const mintBody = {
      pool: body.pool,
      amount: body.amount,
      tokenIndex: body.tokenIndex,
    } as any;
    if (body.messagingMethod) {
      mintBody.message =
        body.messagingMethod === 'broadcast'
          ? getBroadcastMessageBody(body, undefined, FF_MESSAGES.TRANSFER_BROADCAST)
          : getPrivateMessageBody(body, undefined, FF_MESSAGES.TRANSFER_PRIVATE);
    }
    const transfer = await firefly.mintTokens(mintBody);
    return { type: 'token_transfer', id: transfer.localId };
  }

  @Post('/mintblob')
  @HttpCode(202)
  @FormDataSchema(MintBurnBlob)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Mint a token with a binary blob' })
  async mintblob(
    @Req() req: Request,
    @UploadedFile('file') file: Express.Multer.File,
    @QueryParam('ns') namespace: string,
  ): Promise<AsyncResponse> {
    const firefly = getFireflyClient(namespace);
    // See MessagesTemplateController and keep template code up to date.
    const body = plainToClassFromExist(new MintBurnBlob(), req.body);
    const data = await firefly.uploadDataBlob(file.buffer, { filename: file.originalname });
    const mintBody = {
      pool: body.pool,
      amount: body.amount,
      tokenIndex: body.tokenIndex,
    } as any;
    if (body.messagingMethod) {
      mintBody.message =
        body.messagingMethod === 'broadcast'
          ? getBroadcastMessageBody(body, data.id, FF_MESSAGES.TRANSFER_BROADCAST)
          : getPrivateMessageBody(body, data.id, FF_MESSAGES.TRANSFER_PRIVATE);
    }
    const transfer = await firefly.mintTokens(mintBody);
    return { type: 'token_transfer', id: transfer.localId };
  }

  @Post('/burn')
  @HttpCode(202)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Burn tokens within a token pool' })
  async burn(
    @Body() body: TokenMintBurn,
    @QueryParam('ns') namespace: string,
  ): Promise<AsyncResponse> {
    const firefly = getFireflyClient(namespace);
    // See TokensTemplateController and keep template code up to date.
    const burnBody = {
      pool: body.pool,
      amount: body.amount,
      tokenIndex: body.tokenIndex,
    } as any;
    if (body.messagingMethod) {
      burnBody.message =
        body.messagingMethod === 'broadcast'
          ? getBroadcastMessageBody(body, undefined, FF_MESSAGES.TRANSFER_BROADCAST)
          : getPrivateMessageBody(body, undefined, FF_MESSAGES.TRANSFER_PRIVATE);
    }
    const transfer = await firefly.burnTokens(burnBody);
    return { type: 'token_transfer', id: transfer.localId };
  }

  @Post('/burnblob')
  @HttpCode(202)
  @FormDataSchema(MintBurnBlob)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Burn a token with a binary blob' })
  async burnblob(
    @Req() req: Request,
    @UploadedFile('file') file: Express.Multer.File,
    @QueryParam('ns') namespace: string,
  ): Promise<AsyncResponse> {
    const firefly = getFireflyClient(namespace);
    // See MessagesTemplateController and keep template code up to date.
    const body = plainToClassFromExist(new MintBurnBlob(), req.body);
    const data = await firefly.uploadDataBlob(file.buffer, { filename: file.originalname });
    const burnBody = {
      pool: body.pool,
      amount: body.amount,
      tokenIndex: body.tokenIndex,
    } as any;
    if (body.messagingMethod) {
      burnBody.message =
        body.messagingMethod === 'broadcast'
          ? getBroadcastMessageBody(body, data.id, FF_MESSAGES.TRANSFER_BROADCAST)
          : getPrivateMessageBody(body, data.id, FF_MESSAGES.TRANSFER_PRIVATE);
    }
    const transfer = await firefly.burnTokens(burnBody);
    return { type: 'token_transfer', id: transfer.localId };
  }

  @Post('/transfer')
  @HttpCode(202)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Transfer tokens within a token pool' })
  async transfer(
    @Body() body: TokenTransfer,
    @QueryParam('ns') namespace: string,
  ): Promise<AsyncResponse> {
    const firefly = getFireflyClient(namespace);
    // See TokensTemplateController and keep template code up to date.
    const transferBody = {
      pool: body.pool,
      to: body.to,
      amount: body.amount,
      tokenIndex: body.tokenIndex,
    } as any;
    if (body.messagingMethod) {
      transferBody.message =
        body.messagingMethod === 'broadcast'
          ? getBroadcastMessageBody(body, undefined, FF_MESSAGES.TRANSFER_BROADCAST)
          : getPrivateMessageBody(body, undefined, FF_MESSAGES.TRANSFER_PRIVATE);
    }
    const transfer = await firefly.transferTokens(transferBody);
    return { type: 'token_transfer', id: transfer.localId };
  }

  @Post('/transferblob')
  @HttpCode(202)
  @FormDataSchema(TransferBlob)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Transfer a token with a binary blob' })
  async transferblob(
    @Req() req: Request,
    @UploadedFile('file') file: Express.Multer.File,
    @QueryParam('ns') namespace: string,
  ): Promise<AsyncResponse> {
    const firefly = getFireflyClient(namespace);
    // See MessagesTemplateController and keep template code up to date.
    const body = plainToClassFromExist(new TransferBlob(), req.body);
    const data = await firefly.uploadDataBlob(file.buffer, { filename: file.originalname });
    const transferBody = {
      pool: body.pool,
      to: body.to,
      amount: body.amount,
      tokenIndex: body.tokenIndex,
    } as any;
    if (body.messagingMethod) {
      transferBody.message =
        body.messagingMethod === 'broadcast'
          ? getBroadcastMessageBody(body, data.id, FF_MESSAGES.TRANSFER_BROADCAST)
          : getPrivateMessageBody(body, data.id, FF_MESSAGES.TRANSFER_PRIVATE);
    }
    const transfer = await firefly.transferTokens(transferBody);
    return { type: 'token_transfer', id: transfer.localId };
  }

  @Get('/balances')
  @ResponseSchema(TokenBalance, { isArray: true })
  @OpenAPI({ summary: 'Query token balances' })
  async balances(
    @QueryParam('pool') pool: string,
    @QueryParam('key') key: string,
    @QueryParam('ns') namespace: string,
  ): Promise<TokenBalance[]> {
    const firefly = getFireflyClient(namespace);
    const poolMap = new Map<string, TokenPool>();
    const balances = await firefly.getTokenBalances({ pool, key, balance: '>0' });
    for (const b of balances) {
      if (!poolMap.has(b.pool)) {
        const pool = await firefly.getTokenPool(b.pool);
        poolMap.set(b.pool, mapPool(pool));
      }
    }
    return balances.map((b) => ({
      pool: poolMap.get(b.pool),
      key: b.key,
      balance: b.balance,
      tokenIndex: b.tokenIndex,
    }));
  }
}

/**
 * Tokens - Code Templates
 * Allows the frontend to display representative code snippets for backend operations.
 * For demonstration purposes only.
 */
@JsonController('/tokens/template')
@OpenAPI({ tags: ['Tokens'] })
export class TokensTemplateController {
  @Get('/pools')
  tokenpoolsTemplate() {
    return formatTemplate(`
      const pool = await firefly.createTokenPool({
        name: <%= ${q('name')} %>,<% if (symbol) { %>
        <% print('symbol: ' + ${q('symbol')} + ',') } %><% if (contractInterface) { %>
        interface: {
          id: <%= ${q('contractInterface')} %>
        },<% } %>
        type: <%= ${q('type')} %>,
        config: {<% if (address) { %>
          <% print('address: ' + ${q('address')} + ',') } %>
          blockNumber: <%= ${q('blockNumber')} %>,
        }
      });
      return { type: 'token_pool', id: pool.id };
    `);
  }

  @Get('/mint')
  mintTemplate() {
    return formatTemplate(`
      const transfer = await firefly.mintTokens({
        pool: <%= ${q('pool')} %>,
        amount: <%= ${q('amount')} %>,<% if(tokenIndex) { %>
        tokenIndex: <%= ${q(
          'tokenIndex',
        )} %>,<% } %><% if(messagingMethod && (value||jsonValue)) { %>
        message: {
          header: {
            tag: <%= tag ? ${q('tag')} : 'undefined' %>,
            topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
          },<% if(messagingMethod === 'private') { %>
          group: {
            members: [<% for (const r of recipients) { %>
              <% print('{ identity: ' + ${q('r')} + ' },') } %>
            ],
          },<% } %>
          data: [<% if(jsonValue) { %>
            {
              datatype: { 
                name: <%= datatypename ? ${q('datatypename')} : 'undefined' %>,
                version: <%= datatypeversion ? ${q('datatypeversion')} : 'undefined' %>
              },
              value: <%= jsonValue ? ${q('jsonValue', {
                isObject: true,
                truncate: true,
              })} : ${q('value')}%>
            }
              <% } else { %>
                { value: <%= jsonValue ? ${q('jsonValue', {
                  isObject: true,
                  truncate: true,
                })} : ${q('value')}%> }
            <%} 
          %>],
        }
        <% } %>
      });
      return { type: 'token_transfer', id: transfer.localId };
    `);
  }

  @Get('/mintblob')
  sendblobTemplate() {
    return formatTemplate(`
    const data = await firefly.uploadDataBlob(
      file.buffer,
      {
        filename: <%= ${q('filename')} %>,
      },
    );
    const transfer = await firefly.mintTokens({
      pool: <%= ${q('pool')} %>,
      amount: <%= ${q('amount')} %>,<% if (tokenIndex) { %>
      <% print('tokenIndex: ' + ${q(
        'tokenIndex',
      )} + ',') } %><% if(messagingMethod === 'broadcast') { %>
      message: {
        header: {
          tag: <%= tag ? ${q('tag')} : 'undefined' %>,
          topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
        },
        data: [{ id: data.id }],
      }<% } else { %>
      message: {
        header: {
          tag: <%= tag ? ${q('tag')} : 'undefined' %>,
          topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
        },
        group: {
          members: [<%= recipients.map((r) => '{ identity: ' + ${q('r')} + ' }').join(', ') %>],
        },
        data: [{ id: data.id }],
      }
    <%} %>
    });
    return { type: 'token_transfer', id: transfer.localId };
    `);
  }

  @Get('/burn')
  burnTemplate() {
    return formatTemplate(`
      const burn = await firefly.burnTokens({
        pool: <%= ${q('pool')} %>,
        tokenIndex: <%= ${q('tokenIndex')} %>,
        amount: <%= ${q('amount')} %>,<% if(messagingMethod && (value||jsonValue)) { %>
        message: {
          header: {
            tag: <%= tag ? ${q('tag')} : 'undefined' %>,
            topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
          },<% if(messagingMethod === 'private') { %>
            group: {
              members: [<% for (const r of recipients) { %>
                <% print('{ identity: ' + ${q('r')} + ' },') } %>
              ],
            },<% } %>
          data: [<% if(jsonValue) { %>
            {
              datatype: { 
                name: <%= datatypename ? ${q('datatypename')} : 'undefined' %>,
                version: <%= datatypeversion ? ${q('datatypeversion')} : 'undefined' %>
              },
              value: <%= jsonValue ? ${q('jsonValue', {
                isObject: true,
                truncate: true,
              })} : ${q('value')}%>
            }
            <% } else { %>
                { value: <%= jsonValue ? ${q('jsonValue', {
                  isObject: true,
                  truncate: true,
                })} : ${q('value')}%> }
            <%} 
          %>],
        }
        <% } %>
      });
      return { type: 'token_transfer', id: transfer.localId };
    `);
  }

  @Get('/burnblob')
  burnBlobTemplate() {
    return formatTemplate(`
    const data = await firefly.uploadDataBlob(
      file.buffer,
      {
        filename: <%= ${q('filename')} %>,
      },
    );
      const transfer = await firefly.burnTokens({
        pool: <%= ${q('pool')} %>,
        amount: <%= ${q('amount')} %>,<% if (tokenIndex) { %>
          <% print('tokenIndex: ' + ${q(
            'tokenIndex',
          )} + ',') } %>,<% if(messagingMethod === 'broadcast') { %>
        message: {
          header: {
            tag: <%= tag ? ${q('tag')} : 'undefined' %>,
            topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
          },
          data: [{ id: data.id }],
        }<% } else { %>
          message: {
            header: {
              tag: <%= tag ? ${q('tag')} : 'undefined' %>,
              topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
            },
            group: {
              members: [<%= recipients.map((r) => '{ identity: ' + ${q('r')} + ' }').join(', ') %>],
            },
            data: [{ id: data.id }],
          }
      <%} %>
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
        tokenIndex: <%= ${q('tokenIndex')} %>,
        amount: <%= ${q('amount')} %>,<% if(messagingMethod && (value||jsonValue)) { %>
        message: {
          header: {
            tag: <%= tag ? ${q('tag')} : 'undefined' %>,
            topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
          },<% if(messagingMethod === 'private') { %>
            group: {
              members: [<% for (const r of recipients) { %>
                <% print('{ identity: ' + ${q('r')} + ' },') } %>
              ],
          },<% } %>
          data: [<% if(jsonValue) { %>
            {
              datatype: { 
                name: <%= datatypename ? ${q('datatypename')} : 'undefined' %>,
                version: <%= datatypeversion ? ${q('datatypeversion')} : 'undefined' %>
              },
              value: <%= jsonValue ? ${q('jsonValue', {
                isObject: true,
                truncate: true,
              })} : ${q('value')}%>
            }
              <% } else { %>
                { value: <%= jsonValue ? ${q('jsonValue', {
                  isObject: true,
                  truncate: true,
                })} : ${q('value')}%> }
            <%} 
          %>],
        }
        <% } %>
      });
      return { type: 'token_transfer', id: transfer.localId };
    `);
  }

  @Get('/transferblob')
  transferBlobTemplate() {
    return formatTemplate(`
    const data = await firefly.uploadDataBlob(
      file.buffer,
      {
        filename: <%= ${q('filename')} %>,
      },
    );
      const transfer = await firefly.transferTokens({
        pool: <%= ${q('pool')} %>,
        amount: <%= ${q('amount')} %>,<% if (tokenIndex) { %>
          <% print('tokenIndex: ' + ${q(
            'tokenIndex',
          )} + ',') } %>,<% if(messagingMethod === 'broadcast') { %>
        message: {
          header: {
            tag: <%= tag ? ${q('tag')} : 'undefined' %>,
            topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
          },
          data: [{ id: data.id }],
        }<% } else { %>
          message: {
            header: {
              tag: <%= tag ? ${q('tag')} : 'undefined' %>,
              topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
            },
            group: {
              members: [<%= recipients.map((r) => '{ identity: ' + ${q('r')} + ' }').join(', ') %>],
            },
            data: [{ id: data.id }],
          }
      <%} %>
      });
      return { type: 'token_transfer', id: transfer.localId };
    `);
  }
}
