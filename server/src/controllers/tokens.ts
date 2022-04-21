import { Post, Get, HttpCode, Body, JsonController, QueryParam } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { firefly } from '../clients/firefly';
import {
  formatTemplate,
  getBroadcastMessageBody,
  getPrivateMessageBody,
  quoteAndEscape as q,
} from '../utils';
import {
  TokenPool,
  TokenPoolInput,
  TokenMint,
  TokenTransfer,
  TokenBurn,
  TokenBalance,
  AsyncResponse,
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
  async tokenpools(): Promise<TokenPool[]> {
    const pools = await firefly.getTokenPools();
    return pools.map((p) => ({ id: p.id, name: p.name, symbol: p.symbol, type: p.type }));
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
  async mint(@Body() body: TokenMint): Promise<AsyncResponse> {
    // See TokensTemplateController and keep template code up to date.
    const mintBody = {
      pool: body.pool,
      amount: body.amount,
    } as any;
    if (body.messagingMethod) {
      mintBody.message =
        body.messagingMethod === 'broadcast'
          ? getBroadcastMessageBody(body)
          : getPrivateMessageBody(body);
    }
    console.log(mintBody);
    const transfer = await firefly.mintTokens(mintBody);
    return { type: 'token_transfer', id: transfer.localId };
  }

  @Post('/burn')
  @HttpCode(202)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Burn tokens within a token pool' })
  async burn(@Body() body: TokenBurn): Promise<AsyncResponse> {
    // See TokensTemplateController and keep template code up to date.
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
    // See TokensTemplateController and keep template code up to date.
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
    const poolMap = new Map<string, string>();
    const balances = await firefly.getTokenBalances({ pool, key, balance: '>0' });
    for (const b of balances) {
      if (!poolMap.has(b.pool)) {
        const pool = await firefly.getTokenPool(b.pool);
        poolMap.set(b.pool, pool.name);
      }
    }
    return balances.map((b) => ({
      pool: b.pool,
      poolName: poolMap.get(b.pool),
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
        name: <%= ${q('name')} %>,
        symbol: <%= ${q('symbol')} %>,
        type: <%= ${q('type')} %>,
        config: {
          address: <%= ${q('address')} %>,
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
          },
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

  @Get('/burn')
  burnTemplate() {
    return formatTemplate(`
      const transfer = await firefly.burnTokens({
        pool: <%= ${q('pool')} %>,
        amount: <%= ${q('amount')} %>,
        tokenIndex: <%= ${q('tokenIndex')} %>,
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
        tokenIndex: <%= ${q('tokenIndex')} %>,
      });
      return { type: 'token_transfer', id: transfer.localId };
    `);
  }
}
