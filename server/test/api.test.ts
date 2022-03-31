import * as request from 'supertest';
import FireFly from '@photic/firefly-sdk-nodejs';
import { FireFlyMessage } from '@photic/firefly-sdk-nodejs/dist/interfaces';
import { app } from '../src/app';
import { firefly } from '../src/clients/firefly';

jest.mock('@photic/firefly-sdk-nodejs');
const mockFireFly = firefly as jest.MockedObject<FireFly>;

describe('Messages', () => {
  test('Broadcast', () => {
    const msg = {
      header: { id: '123' },
    } as FireFlyMessage;

    mockFireFly.sendBroadcast.mockResolvedValueOnce(msg);

    return request(app).post('/api/messages/broadcast').expect(202).expect(msg);
  });
});

describe('Misc', () => {
  test('Swagger UI', () => {
    return request(app).get('/api/').expect(200);
  });
});
