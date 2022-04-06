import * as request from 'supertest';
import FireFly, {
  FireFlyDataRef,
  FireFlyMessage,
  FireFlyOrganization,
  FireFlyStatus,
  FireFlyTokenPool,
  FireFlyTokenPoolType,
} from '@photic/firefly-sdk-nodejs';
import server from '../src/server';
import { firefly } from '../src/clients/firefly';
import { BroadcastValue, PrivateValue, TokenPoolInput } from '../src/interfaces';

jest.mock('@photic/firefly-sdk-nodejs');
const mockFireFly = firefly as jest.MockedObject<FireFly>;

describe('Simple Operations', () => {
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
      .post('/api/simple/broadcast')
      .send(req)
      .expect(202)
      .expect({ id: 'msg1' });

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
      .post('/api/simple/broadcastblob')
      .field('tag', 'test-tag')
      .attach('file', 'test/data/simple-file.txt')
      .expect(202)
      .expect({ id: 'msg1' });

    expect(mockFireFly.uploadDataBlob).toHaveBeenCalledWith(expect.any(Buffer), 'simple-file.txt');
    expect(mockFireFly.sendBroadcast).toHaveBeenCalledWith({
      header: { tag: 'test-tag' },
      data: [data],
    });
  });

  test('List organizations', async () => {
    const orgs = [{ id: 'org1' } as FireFlyOrganization, { id: 'org2' } as FireFlyOrganization];

    mockFireFly.getOrganizations.mockResolvedValueOnce(orgs);

    await request(server)
      .get('/api/simple/organizations')
      .expect(200)
      .expect([{ id: 'org1' }, { id: 'org2' }]);

    expect(mockFireFly.getOrganizations).toHaveBeenCalledWith();
  });

  test('List organizations without self', async () => {
    const status = {
      org: { id: 'org1' },
    } as FireFlyStatus;
    const orgs = [{ id: 'org1' } as FireFlyOrganization, { id: 'org2' } as FireFlyOrganization];

    mockFireFly.getStatus.mockResolvedValueOnce(status);
    mockFireFly.getOrganizations.mockResolvedValueOnce(orgs);

    await request(server)
      .get('/api/simple/organizations?exclude_self=true')
      .expect(200)
      .expect([{ id: 'org2' }]);

    expect(mockFireFly.getStatus).toHaveBeenCalledWith();
    expect(mockFireFly.getOrganizations).toHaveBeenCalledWith();
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

    await request(server).post('/api/simple/private').send(req).expect(202).expect({ id: 'msg1' });

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
      .post('/api/simple/privateblob')
      .field('tag', 'test-tag')
      .field('recipients[]', 'alpha')
      .field('recipients[]', 'beta')
      .attach('file', 'test/data/simple-file.txt')
      .expect(202)
      .expect({ id: 'msg1' });

    expect(mockFireFly.uploadDataBlob).toHaveBeenCalledWith(expect.any(Buffer), 'simple-file.txt');
    expect(mockFireFly.sendPrivateMessage).toHaveBeenCalledWith({
      header: { tag: 'test-tag' },
      group: {
        members: [{ identity: 'alpha' }, { identity: 'beta' }],
      },
      data: [data],
    });
  });

  test('List token pools', async () => {
    const pools = [{ id: 'pool1' } as FireFlyTokenPool, { id: 'pool2' } as FireFlyTokenPool];

    mockFireFly.getTokenPools.mockResolvedValueOnce(pools);

    await request(server)
      .get('/api/simple/tokenpools')
      .expect(200)
      .expect([{ id: 'pool1' }, { id: 'pool2' }]);

    expect(mockFireFly.getTokenPools).toHaveBeenCalledWith();
  });

  test('Create token pool', async () => {
    const req: TokenPoolInput = {
      name: 'my-pool',
      symbol: 'P1',
      type: FireFlyTokenPoolType.FUNGIBLE,
    };
    const pool = {
      id: 'pool1',
    } as FireFlyTokenPool;

    mockFireFly.createTokenPool.mockResolvedValueOnce(pool);

    await request(server)
      .post('/api/simple/tokenpools')
      .send(req)
      .expect(202)
      .expect({ id: 'pool1' });

    expect(mockFireFly.createTokenPool).toHaveBeenCalledWith({
      name: 'my-pool',
      symbol: 'P1',
      type: 'fungible',
    });
  });
});

describe('Misc', () => {
  test('Swagger UI', () => {
    return request(server).get('/api').redirects(1).expect(200);
  });
});
