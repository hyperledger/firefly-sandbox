import * as request from 'supertest';
import FireFly, {
  FireFlyDataRef,
  FireFlyMessage,
  FireFlyOrganization,
  FireFlyStatus,
  FireFlyTokenBalance,
  FireFlyTokenPool,
  FireFlyTokenPoolType,
  FireFlyTokenTransfer,
  FireFlyVerifier,
} from '@photic/firefly-sdk-nodejs';
import server from '../src/server';
import { firefly } from '../src/clients/firefly';
import {
  BroadcastValue,
  PrivateValue,
  TokenBurn,
  TokenMint,
  TokenPoolInput,
  TokenTransfer,
} from '../src/interfaces';

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
      .post('/api/simple/broadcastblob')
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
    const status = { org: { id: 'org1' } } as FireFlyStatus;
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

  test('Get self', async () => {
    const status = { org: { id: 'org1' } } as FireFlyStatus;

    mockFireFly.getStatus.mockResolvedValueOnce(status);

    await request(server).get('/api/simple/organizations/self').expect(200).expect({ id: 'org1' });

    expect(mockFireFly.getStatus).toHaveBeenCalledWith();
  });

  test('List verifiers', async () => {
    const orgs = [{ id: 'org1', did: 'did:org1' } as FireFlyOrganization];
    const verifiers = [{ identity: 'org1', value: '0x123' } as FireFlyVerifier];

    mockFireFly.getOrganizations.mockResolvedValueOnce(orgs);
    mockFireFly.getVerifiers.mockResolvedValueOnce(verifiers);

    await request(server)
      .get('/api/simple/verifiers')
      .expect(200)
      .expect([{ did: 'did:org1', value: '0x123' }]);

    expect(mockFireFly.getOrganizations).toHaveBeenCalledWith();
    expect(mockFireFly.getVerifiers).toHaveBeenCalledWith('ff_system');
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
      .post('/api/simple/private')
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
      .post('/api/simple/privateblob')
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
      message: 'msg1',
      tx: { id: 'tx1' },
    } as FireFlyTokenPool;

    mockFireFly.createTokenPool.mockResolvedValueOnce(pool);

    await request(server)
      .post('/api/simple/tokenpools')
      .send(req)
      .expect(202)
      .expect({ type: 'message', id: 'msg1' });

    expect(mockFireFly.createTokenPool).toHaveBeenCalledWith({
      name: 'my-pool',
      symbol: 'P1',
      type: 'fungible',
    });
  });

  test('Mint tokens', async () => {
    const req: TokenMint = {
      pool: 'my-pool',
      amount: 10,
    };
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransfer;

    mockFireFly.mintTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/simple/mint')
      .send(req)
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.mintTokens).toHaveBeenCalledWith({
      pool: 'my-pool',
      amount: 10,
    });
  });

  test('Burn tokens', async () => {
    const req: TokenBurn = {
      pool: 'my-pool',
      amount: 1,
    };
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransfer;

    mockFireFly.burnTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/simple/burn')
      .send(req)
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.burnTokens).toHaveBeenCalledWith({
      pool: 'my-pool',
      amount: 1,
    });
  });

  test('Transfer tokens', async () => {
    const req: TokenTransfer = {
      pool: 'my-pool',
      amount: 1,
      to: '0x111',
    };
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransfer;

    mockFireFly.transferTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/simple/transfer')
      .send(req)
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.transferTokens).toHaveBeenCalledWith({
      pool: 'my-pool',
      amount: 1,
      to: '0x111',
    });
  });

  test('Get balances', async () => {
    const balances = [{ key: '0x123', balance: '1' } as FireFlyTokenBalance];

    mockFireFly.getTokenBalances.mockResolvedValueOnce(balances);

    await request(server)
      .get('/api/simple/balances?pool=pool1&key=0x123')
      .expect(200)
      .expect([{ key: '0x123', balance: '1' }]);

    expect(mockFireFly.getTokenBalances).toHaveBeenCalledWith({
      pool: 'pool1',
      key: '0x123',
      balance: '>0',
    });
  });
});
