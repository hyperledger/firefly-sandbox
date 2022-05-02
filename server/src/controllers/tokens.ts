import {
  Post,
  Get,
  HttpCode,
  Body,
  JsonController,
  QueryParam,
  Req,
  UploadedFile,
} from 'routing-controllers';
import { Request } from 'express';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { firefly } from '../clients/firefly';
import {
  formatTemplate,
  FormDataSchema,
  getBroadcastMessageBody,
  getPrivateMessageBody,
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
import { plainToClassFromExist } from 'class-transformer';

/**
 * Tokens - API Server
 */
@JsonController('/tokens')
@OpenAPI({ tags: ['Tokens'] })
export class TokensController {
  @Get('/pools')
  @ResponseSchema(TokenPool, { isArray: true })
  @OpenAPI({ summary: 'List all token pools' })
  async tokenpools(): Promise<TokenPool[]> {
    const pools = await firefly.getTokenPools();
    return pools.map((p) => ({
      id: p.id,
      name: p.name,
      symbol: p.symbol,
      type: p.type,
      decimals: p.decimals,
    }));
  }

  @Post('/pools')
  @HttpCode(202)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Create a token pool' })
  async createtokenpool(@Body() body: TokenPoolInput): Promise<AsyncResponse> {
    // See TokensTemplateController and keep template code up to date.
    const pool = await firefly.createTokenPool({
      name: body.name,
      symbol: body.symbol,
      type: body.type,
      config: {
        address: body.address,
      },
    });
    return { type: 'token_pool', id: pool.id };
  }

  @Post('/mint')
  @HttpCode(202)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Mint tokens within a token pool' })
  async mint(@Body() body: TokenMintBurn): Promise<AsyncResponse> {
    // See TokensTemplateController and keep template code up to date.
    const mintBody = {
      pool: body.pool,
      amount: body.amount,
      tokenIndex: body.tokenIndex,
    } as any;
    if (body.messagingMethod) {
      mintBody.message =
        body.messagingMethod === 'broadcast'
          ? getBroadcastMessageBody(body)
          : getPrivateMessageBody(body);
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
  ): Promise<AsyncResponse> {
    // See MessagesTemplateController and keep template code up to date.
    const body = plainToClassFromExist(new MintBurnBlob(), req.body);
    const data = await firefly.uploadDataBlob(file.buffer, file.originalname);
    const mintBody = {
      pool: body.pool,
      amount: body.amount,
    } as any;
    if (body.messagingMethod) {
      mintBody.message =
        body.messagingMethod === 'broadcast'
          ? getBroadcastMessageBody(body, data.id)
          : getPrivateMessageBody(body, data.id);
    }
    const transfer = await firefly.mintTokens(mintBody);
    return { type: 'token_transfer', id: transfer.localId };
  }

  @Post('/burn')
  @HttpCode(202)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Burn tokens within a token pool' })
  async burn(@Body() body: TokenMintBurn): Promise<AsyncResponse> {
    // See TokensTemplateController and keep template code up to date.
    const burnBody = {
      pool: body.pool,
      amount: body.amount,
      tokenIndex: body.tokenIndex,
    } as any;
    if (body.messagingMethod) {
      burnBody.message =
        body.messagingMethod === 'broadcast'
          ? getBroadcastMessageBody(body)
          : getPrivateMessageBody(body);
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
  ): Promise<AsyncResponse> {
    // See MessagesTemplateController and keep template code up to date.
    const body = plainToClassFromExist(new MintBurnBlob(), req.body);
    const data = await firefly.uploadDataBlob(file.buffer, file.originalname);
    const burnBody = {
      pool: body.pool,
      amount: body.amount,
      tokenIndex: body.tokenIndex,
    } as any;
    if (body.messagingMethod) {
      burnBody.message =
        body.messagingMethod === 'broadcast'
          ? getBroadcastMessageBody(body, data.id)
          : getPrivateMessageBody(body, data.id);
    }
    const transfer = await firefly.burnTokens(burnBody);
    return { type: 'token_transfer', id: transfer.localId };
  }

  @Post('/transfer')
  @HttpCode(202)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Transfer tokens within a token pool' })
  async transfer(@Body() body: TokenTransfer): Promise<AsyncResponse> {
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
          ? getBroadcastMessageBody(body)
          : getPrivateMessageBody(body);
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
  ): Promise<AsyncResponse> {
    // See MessagesTemplateController and keep template code up to date.
    const body = plainToClassFromExist(new TransferBlob(), req.body);
    const data = await firefly.uploadDataBlob(file.buffer, file.originalname);
    const transferBody = {
      pool: body.pool,
      to: body.to,
      amount: body.amount,
      tokenIndex: body.tokenIndex,
    } as any;
    if (body.messagingMethod) {
      transferBody.message =
        body.messagingMethod === 'broadcast'
          ? getBroadcastMessageBody(body, data.id)
          : getPrivateMessageBody(body, data.id);
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
  ): Promise<TokenBalance[]> {
    const poolMap = new Map<string, TokenPool>();
    const balances = await firefly.getTokenBalances({ pool, key, balance: '>0' });
    for (const b of balances) {
      if (!poolMap.has(b.pool)) {
        const pool = await firefly.getTokenPool(b.pool);
        poolMap.set(b.pool, pool);
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
        <% print('symbol: ' + ${q('symbol')} + ',') } %>
        type: <%= ${q('type')} %>,
        config: {<% if (address) { %>
          <% print('address: ' + ${q('address')} + ',') } %>
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

  @Get('/mintblob')
  sendblobTemplate() {
    return formatTemplate(`
    const data = await firefly.uploadDataBlob(
      file.buffer,
      <%= ${q('filename')} %>,
    );
      const transfer = await firefly.mintTokens({
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
        }
        <% } else { %>
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
      <%= ${q('filename')} %>,
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
        }
        <% } else { %>
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
      <%= ${q('filename')} %>,
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
        }
        <% } else { %>
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
