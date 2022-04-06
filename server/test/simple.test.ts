import * as request from 'supertest';
import FireFly, { FireFlyDataRef, FireFlyMessage } from '@photic/firefly-sdk-nodejs';
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

  test('Broadcast with value', async () => {
    const req: BroadcastRequest = {
      tag: 'test-tag',
      topic: 'test-topic',
      value: 'Hello',
    };
    const msg = {
      header: { id: 'msg1' },
    } as FireFlyMessage;

    mockFireFly.sendBroadcast.mockResolvedValueOnce(msg);

    await request(server).post('/api/simple/broadcast').send(req).expect(202).expect(msg);

    expect(mockFireFly.uploadDataBlob).not.toHaveBeenCalled();
    expect(mockFireFly.sendBroadcast).toHaveBeenCalledWith({
      header: { tag: 'test-tag', topics: ['test-topic'] },
      data: [{ value: 'Hello' }],
    });
  });

  test('Broadcast with blob', async () => {
    const data = {
      id: 'data1',
    } as FireFlyDataRef;
    const msg = {
      header: { id: 'msg1' },
    } as FireFlyMessage;

    mockFireFly.uploadDataBlob.mockResolvedValueOnce(data);
    mockFireFly.sendBroadcast.mockResolvedValueOnce(msg);

    await request(server)
      .post('/api/simple/broadcast')
      .field('tag', 'test-tag')
      .attach('file', 'test/data/simple-file.txt')
      .expect(202)
      .expect(msg);

    expect(mockFireFly.uploadDataBlob).toHaveBeenCalledWith(expect.any(Buffer), 'simple-file.txt');
    expect(mockFireFly.sendBroadcast).toHaveBeenCalledWith({
      header: { tag: 'test-tag' },
      data: [data],
    });
  });
});

describe('Misc', () => {
  test('Swagger UI', () => {
    return request(server).get('/api/').expect(200);
  });
});
