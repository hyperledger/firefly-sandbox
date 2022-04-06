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
              }
              data: [{ value: '' }],
            });
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
              }
              data: [{ value: '\\'Hello\\'' }],
            });
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
              }
              data: [{ id: data.id }],
            });
        `),
        );
      });
  });
});
