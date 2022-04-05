import * as request from 'supertest';
import FireFly, { FireFlyMessage } from '@photic/firefly-sdk-nodejs';
import server from '../src/server';
import { firefly } from '../src/clients/firefly';
import { BroadcastRequest } from '../src/interfaces';

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
});

describe('Misc', () => {
  test('Swagger UI', () => {
    return request(server).get('/api/').expect(200);
  });
});
