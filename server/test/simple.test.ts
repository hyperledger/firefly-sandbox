import * as request from 'supertest';
import FireFly, { FireFlyMessage } from '@photic/firefly-sdk-nodejs';
import * as _ from 'underscore';
import server from '../src/server';
import { firefly } from '../src/clients/firefly';
import { BroadcastRequest } from '../src/interfaces';
import { formatTemplate } from '../src/utils';

jest.mock('@photic/firefly-sdk-nodejs');
const mockFireFly = firefly as jest.MockedObject<FireFly>;

describe('Simple Operations', () => {
  beforeEach((done) => {
    server.listen(0, 'localhost', done);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('Broadcast', () => {
    const req: BroadcastRequest = {
      value: 'Hello',
    };

    const msg = {} as FireFlyMessage;
    mockFireFly.sendBroadcast.mockResolvedValueOnce(msg);

    return request(server).post('/api/simple/broadcast').send(req).expect(202).expect(msg);
  });

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
            return firefly.sendBroadcast({
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
            return firefly.sendBroadcast({
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
});

describe('Misc', () => {
  test('Swagger UI', () => {
    return request(server).get('/api/').expect(200);
  });
});
