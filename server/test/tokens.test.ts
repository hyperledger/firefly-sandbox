import * as request from 'supertest';
import FireFly, {
  FireFlyTokenBalance,
  FireFlyTokenPool,
  FireFlyTokenPoolType,
  FireFlyTokenTransfer,
} from '@hyperledger/firefly-sdk';
import server from '../src/server';
import { firefly } from '../src/clients/firefly';
import { TokenBurn, TokenMint, TokenPoolInput, TokenTransfer } from '../src/interfaces';

jest.mock('@hyperledger/firefly-sdk');
const mockFireFly = firefly as jest.MockedObject<FireFly>;

describe('Tokens', () => {
  test('List token pools', async () => {
    const pools = [{ id: 'pool1' } as FireFlyTokenPool, { id: 'pool2' } as FireFlyTokenPool];

    mockFireFly.getTokenPools.mockResolvedValueOnce(pools);

    await request(server)
      .get('/api/tokens/pools')
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
      tx: { id: 'tx1' },
    } as FireFlyTokenPool;

    mockFireFly.createTokenPool.mockResolvedValueOnce(pool);

    await request(server)
      .post('/api/tokens/pools')
      .send(req)
      .expect(202)
      .expect({ type: 'token_pool', id: 'pool1' });

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
      .post('/api/tokens/mint')
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
      .post('/api/tokens/burn')
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
      .post('/api/tokens/transfer')
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
    const balances = [{ key: '0x123', balance: '1', pool: 'pool1' } as FireFlyTokenBalance];

    mockFireFly.getTokenPool.mockResolvedValueOnce({ name: 'pool-name' } as FireFlyTokenPool);
    mockFireFly.getTokenBalances.mockResolvedValueOnce(balances);

    await request(server)
      .get('/api/tokens/balances?pool=pool1&key=0x123')
      .expect(200)
      .expect([{ key: '0x123', balance: '1', pool: 'pool1', poolName: 'pool-name' }]);

    expect(mockFireFly.getTokenBalances).toHaveBeenCalledWith({
      pool: 'pool1',
      key: '0x123',
      balance: '>0',
    });
  });
});
