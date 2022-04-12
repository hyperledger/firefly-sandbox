import * as request from 'supertest';
import FireFly, { FireFlyDataRef, FireFlyMessage } from '@hyperledger/firefly-sdk';
import server from '../src/server';
import { firefly } from '../src/clients/firefly';
import { BroadcastValue, PrivateValue } from '../src/interfaces';

jest.mock('@hyperledger/firefly-sdk');
const mockFireFly = firefly as jest.MockedObject<FireFly>;

describe('Messages', () => {
  test('Broadcast with value', async () => {
    const req: BroadcastValue = {
      tag: 'test-tag',
      topic: 'test-topic',
      value: 'Hello',
    };
    const msg = {
      header: { id: 'msg1' },
    } as FireFlyMessage;

    mockFireFly.sendBroadcast.mockResolvedValueOnce(msg);

    await request(server)
      .post('/api/messages/broadcast')
      .send(req)
      .expect(202)
      .expect({ type: 'message', id: 'msg1' });

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
      .post('/api/messages/broadcastblob')
      .field('tag', 'test-tag')
      .attach('file', 'test/data/simple-file.txt')
      .expect(202)
      .expect({ type: 'message', id: 'msg1' });

    expect(mockFireFly.uploadDataBlob).toHaveBeenCalledWith(expect.any(Buffer), 'simple-file.txt');
    expect(mockFireFly.sendBroadcast).toHaveBeenCalledWith({
      header: { tag: 'test-tag' },
      data: [data],
    });
  });

  test('Private with value', async () => {
    const req: PrivateValue = {
      tag: 'test-tag',
      topic: 'test-topic',
      value: 'Hello',
      recipients: ['alpha', 'beta'],
    };
    const msg = {
      header: { id: 'msg1' },
    } as FireFlyMessage;

    mockFireFly.sendPrivateMessage.mockResolvedValueOnce(msg);

    await request(server)
      .post('/api/messages/private')
      .send(req)
      .expect(202)
      .expect({ type: 'message', id: 'msg1' });

    expect(mockFireFly.uploadDataBlob).not.toHaveBeenCalled();
    expect(mockFireFly.sendPrivateMessage).toHaveBeenCalledWith({
      header: { tag: 'test-tag', topics: ['test-topic'] },
      group: {
        members: [{ identity: 'alpha' }, { identity: 'beta' }],
      },
      data: [{ value: 'Hello' }],
    });
  });

  test('Private with blob', async () => {
    const data = {
      id: 'data1',
    } as FireFlyDataRef;
    const msg = {
      header: { id: 'msg1' },
    } as FireFlyMessage;

    mockFireFly.uploadDataBlob.mockResolvedValueOnce(data);
    mockFireFly.sendPrivateMessage.mockResolvedValueOnce(msg);

    await request(server)
      .post('/api/messages/privateblob')
      .field('tag', 'test-tag')
      .field('recipients[]', 'alpha')
      .field('recipients[]', 'beta')
      .attach('file', 'test/data/simple-file.txt')
      .expect(202)
      .expect({ type: 'message', id: 'msg1' });

    expect(mockFireFly.uploadDataBlob).toHaveBeenCalledWith(expect.any(Buffer), 'simple-file.txt');
    expect(mockFireFly.sendPrivateMessage).toHaveBeenCalledWith({
      header: { tag: 'test-tag' },
      group: {
        members: [{ identity: 'alpha' }, { identity: 'beta' }],
      },
      data: [data],
    });
  });
});
