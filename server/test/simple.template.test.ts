import * as request from 'supertest';
import * as _ from 'underscore';
import server from '../src/server';
import { formatTemplate } from '../src/utils';

describe('Templates: Simple Operations', () => {
  test('Broadcast template', () => {
    return request(server)
      .get('/api/simple/template/broadcast')
      .expect(200)
      .expect((resp) => {
        const compiled = _.template(resp.body);

        expect(
          compiled({
            tag: '',
            topic: '',
            value: '',
          }),
        ).toBe(
          formatTemplate(`
            const message = await firefly.sendBroadcast({
              header: {
                tag: undefined,
                topics: undefined,
              },
              data: [{ value: '' }],
            });
            return { type: 'message', id: message.header.id };
        `),
        );

        expect(
          compiled({
            tag: 'test-tag',
            topic: 'test-topic',
            value: "'Hello'",
          }),
        ).toBe(
          formatTemplate(`
            const message = await firefly.sendBroadcast({
              header: {
                tag: 'test-tag',
                topics: ['test-topic'],
              },
              data: [{ value: '\\'Hello\\'' }],
            });
            return { type: 'message', id: message.header.id };
        `),
        );
      });
  });

  test('Broadcast blob template', () => {
    return request(server)
      .get('/api/simple/template/broadcastblob')
      .expect(200)
      .expect((resp) => {
        const compiled = _.template(resp.body);
        expect(
          compiled({
            tag: 'test-tag',
            topic: 'test-topic',
            filename: 'document.pdf',
          }),
        ).toBe(
          formatTemplate(`
            const data = await firefly.uploadDataBlob(file.buffer, 'document.pdf');
            const message = await firefly.sendBroadcast({
              header: {
                tag: 'test-tag',
                topics: ['test-topic'],
              },
              data: [{ id: data.id }],
            });
            return { type: 'message', id: message.header.id };
        `),
        );
      });
  });

  test('Private template', () => {
    return request(server)
      .get('/api/simple/template/private')
      .expect(200)
      .expect((resp) => {
        const compiled = _.template(resp.body);

        expect(
          compiled({
            tag: '',
            topic: '',
            value: '',
            recipients: [],
          }),
        ).toBe(
          formatTemplate(`
            const message = await firefly.sendPrivateMessage({
              header: {
                tag: undefined,
                topics: undefined,
              },
              group: {
                members: [],
              },
              data: [{ value: '' }],
            });
            return { type: 'message', id: message.header.id };
        `),
        );

        expect(
          compiled({
            tag: 'test-tag',
            topic: 'test-topic',
            value: "'Hello'",
            recipients: ['alpha', 'beta'],
          }),
        ).toBe(
          formatTemplate(`
            const message = await firefly.sendPrivateMessage({
              header: {
                tag: 'test-tag',
                topics: ['test-topic'],
              },
              group: {
                members: [{identity: 'alpha'}, {identity: 'beta'}],
              },
              data: [{ value: '\\'Hello\\'' }],
            });
            return { type: 'message', id: message.header.id };
        `),
        );
      });
  });

  test('Private blob template', () => {
    return request(server)
      .get('/api/simple/template/privateblob')
      .expect(200)
      .expect((resp) => {
        const compiled = _.template(resp.body);
        expect(
          compiled({
            tag: 'test-tag',
            topic: 'test-topic',
            filename: 'document.pdf',
            recipients: ['alpha', 'beta'],
          }),
        ).toBe(
          formatTemplate(`
            const data = await firefly.uploadDataBlob(file.buffer, 'document.pdf');
            const message = await firefly.sendPrivateMessage({
              header: {
                tag: 'test-tag',
                topics: ['test-topic'],
              },
              group: {
                members: [{identity: 'alpha'}, {identity: 'beta'}],
              },
              data: [{ id: data.id }],
            });
            return { type: 'message', id: message.header.id };
        `),
        );
      });
  });

  test('Token pool template', () => {
    return request(server)
      .get('/api/simple/template/tokenpools')
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
      .get('/api/simple/template/mint')
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
      .get('/api/simple/template/burn')
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
      .get('/api/simple/template/transfer')
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
});
