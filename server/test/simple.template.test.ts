import * as request from 'supertest';
import * as _ from 'underscore';
import server from '../src/server';
import { formatTemplate } from '../src/utils';

describe('Templates: Simple Operations', () => {
  test('Broadcast', () => {
    return request(server)
      .get('/api/simple/template/broadcast')
      .expect(200)
      .expect((resp) => {
        const compiled = _.template(resp.body);

        // All empty values
        expect(
          compiled({
            tag: '',
            topic: '',
            value: '',
            filename: '',
          }),
        ).toBe(
          formatTemplate(`
            const data = { value: '' };
            return firefly.sendBroadcast({
              header: {
                tag: undefined,
                topics: undefined,
              }
              data: [data],
            });
        `),
        );

        // Inline value
        expect(
          compiled({
            tag: 'test-tag',
            topic: 'test-topic',
            value: "'Hello'",
            filename: '',
          }),
        ).toBe(
          formatTemplate(`
            const data = { value: '\\'Hello\\'' };
            return firefly.sendBroadcast({
              header: {
                tag: 'test-tag',
                topics: ['test-topic'],
              }
              data: [data],
            });
        `),
        );

        // File value
        expect(
          compiled({
            tag: 'test-tag',
            topic: 'test-topic',
            value: '',
            filename: 'document.pdf',
          }),
        ).toBe(
          formatTemplate(`
            const data = await firefly.uploadDataBlob(file.buffer, 'document.pdf');
            return firefly.sendBroadcast({
              header: {
                tag: 'test-tag',
                topics: ['test-topic'],
              }
              data: [data],
            });
        `),
        );
      });
  });
});
