import * as request from 'supertest';
import * as _ from 'underscore';
import server from '../src/server';
import { formatTemplate } from '../src/utils';

describe('Templates: Tokens', () => {
  test('Token pool template', () => {
    return request(server)
      .get('/api/tokens/template/pools')
      .expect(200)
      .expect((resp) => {
        const compiled = _.template(resp.body);
        expect(
          compiled({
            name: 'pool1',
            symbol: 'P1',
            type: 'fungible',
          }),
        ).toBe(
          formatTemplate(`
            const pool = await firefly.createTokenPool({
              name: 'pool1',
              symbol: 'P1',
              type: 'fungible',
            });
            return { type: 'message', id: pool.message };
        `),
        );
      });
  });

  test('Mint template', () => {
    return request(server)
      .get('/api/tokens/template/mint')
      .expect(200)
      .expect((resp) => {
        const compiled = _.template(resp.body);
        expect(
          compiled({
            pool: 'pool1',
            amount: 10,
          }),
        ).toBe(
          formatTemplate(`
            const transfer = await firefly.mintTokens({
              pool: 'pool1',
              amount: '10',
            });
            return { type: 'token_transfer', id: transfer.localId };
        `),
        );
      });
  });

  test('Burn template', () => {
    return request(server)
      .get('/api/tokens/template/burn')
      .expect(200)
      .expect((resp) => {
        const compiled = _.template(resp.body);
        expect(
          compiled({
            pool: 'pool1',
            amount: 1,
            tokenIndex: '1',
          }),
        ).toBe(
          formatTemplate(`
            const transfer = await firefly.burnTokens({
              pool: 'pool1',
              amount: '1',
              tokenIndex: '1',
            });
            return { type: 'token_transfer', id: transfer.localId };
        `),
        );
      });
  });

  test('Transfer template', () => {
    return request(server)
      .get('/api/tokens/template/transfer')
      .expect(200)
      .expect((resp) => {
        const compiled = _.template(resp.body);
        expect(
          compiled({
            pool: 'pool1',
            amount: 1,
            tokenIndex: '1',
            to: '0x111',
          }),
        ).toBe(
          formatTemplate(`
            const transfer = await firefly.transferTokens({
              pool: 'pool1',
              to: '0x111',
              amount: '1',
              tokenIndex: '1',
            });
            return { type: 'token_transfer', id: transfer.localId };
        `),
        );
      });
  });

  test('Balances template', () => {
    return request(server)
      .get('/api/tokens/template/balances')
      .expect(200)
      .expect((resp) => {
        const compiled = _.template(resp.body);
        expect(
          compiled({
            pool: 'pool1',
            key: '0x111',
          }),
        ).toBe(
          formatTemplate(`
            const balances = await firefly.getTokenBalances({
              pool: 'pool1',
              key: '0x111',
              balance: '>0',
            });
            return balances.map((b) => ({
              pool: b.pool,
              key: b.key,
              balance: b.balance,
              tokenIndex: b.tokenIndex,
            }));
        `),
        );
      });
  });
});
