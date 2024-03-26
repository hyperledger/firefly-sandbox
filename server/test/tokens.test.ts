import FireFly, {
  FireFlyDataResponse,
  FireFlyMessageResponse,
  FireFlyTokenBalanceResponse,
  FireFlyTokenPoolResponse,
  FireFlyTokenTransferResponse,
} from '@hyperledger/firefly-sdk';
import * as request from 'supertest';
import { getFireflyClient } from '../src/clients/fireflySDKWrapper';
import { TokenMintBurn, TokenPoolInput, TokenTransfer } from '../src/interfaces';
import server from '../src/server';

const firefly = getFireflyClient();
jest.mock('@hyperledger/firefly-sdk');
const mockFireFly = firefly as jest.MockedObject<FireFly>;

describe('Tokens', () => {
  test('List token pools', async () => {
    const pools = [
      { id: 'pool1' } as FireFlyTokenPoolResponse,
      { id: 'pool2' } as FireFlyTokenPoolResponse,
    ];

    mockFireFly.getTokenPools.mockResolvedValueOnce(pools);

    await request(server)
      .get('/api/tokens/pools')
      .expect(200)
      .expect([
        { id: 'pool1', decimals: 0, dataSupport: true },
        { id: 'pool2', decimals: 0, dataSupport: true },
      ]);

    expect(mockFireFly.getTokenPools).toHaveBeenCalledWith();
  });

  test('Create token pool', async () => {
    const req: TokenPoolInput = {
      name: 'my-pool',
      symbol: 'P1',
      type: 'fungible',
    };
    const pool = {
      id: 'pool1',
      tx: { id: 'tx1' },
    } as FireFlyTokenPoolResponse;

    mockFireFly.createTokenPool.mockResolvedValueOnce(pool);

    await request(server)
      .post('/api/tokens/pools')
      .send(req)
      .expect(202)
      .expect({ type: 'token_pool', id: 'pool1' });

    expect(mockFireFly.createTokenPool).toHaveBeenCalledWith(
      {
        name: 'my-pool',
        symbol: 'P1',
        type: 'fungible',
        config: {},
      },
      {},
    );
  });

  test('Mint tokens', async () => {
    const req: TokenMintBurn = {
      pool: 'my-pool',
      amount: '10',
      recipients: null,
    };
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.mintTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/mint')
      .send(req)
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.mintTokens).toHaveBeenCalledWith({
      pool: 'my-pool',
      amount: '10',
    });
  });

  test('Mint tokens with broadcast message', async () => {
    const req: TokenMintBurn = {
      pool: 'my-pool',
      amount: '1',
      recipients: null,
      messagingMethod: 'broadcast',
      value: 'hello',
      tag: 'test',
      topic: 'one',
    };
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.mintTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/mint')
      .send(req)
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.mintTokens).toHaveBeenCalledWith({
      amount: '1',
      message: {
        data: [
          {
            value: 'hello',
          },
        ],
        header: {
          tag: 'test',
          topics: ['one'],
          type: 'transfer_broadcast',
        },
      },
      pool: 'my-pool',
      tokenIndex: undefined,
    });
  });

  test('Mint tokens with broadcast JSON', async () => {
    const req: TokenMintBurn = {
      pool: 'my-pool',
      amount: '1',
      recipients: null,
      messagingMethod: 'broadcast',
      jsonValue: { content: 'This is a message' },
      tag: 'test',
      topic: 'one',
    };
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.mintTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/mint')
      .send(req)
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.mintTokens).toHaveBeenCalledWith({
      amount: '1',
      message: {
        data: [
          {
            value: { content: 'This is a message' },
          },
        ],
        header: {
          tag: 'test',
          topics: ['one'],
          type: 'transfer_broadcast',
        },
      },
      pool: 'my-pool',
      tokenIndex: undefined,
    });
  });

  test('Mint tokens with private message', async () => {
    const req: TokenMintBurn = {
      pool: 'my-pool',
      amount: '1',
      recipients: ['alpha', 'beta'],
      messagingMethod: 'private',
      value: 'hello',
      tag: 'test',
      topic: 'one',
    };
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.mintTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/mint')
      .send(req)
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.mintTokens).toHaveBeenCalledWith({
      amount: '1',
      message: {
        data: [
          {
            value: 'hello',
          },
        ],
        header: {
          tag: 'test',
          topics: ['one'],
          type: 'transfer_private',
        },
        group: {
          members: [{ identity: 'alpha' }, { identity: 'beta' }],
        },
      },
      pool: 'my-pool',
      tokenIndex: undefined,
    });
  });

  test('Mint tokens with private JSON', async () => {
    const req: TokenMintBurn = {
      pool: 'my-pool',
      amount: '1',
      recipients: ['alpha', 'beta'],
      messagingMethod: 'private',
      jsonValue: { content: 'This is a message' },
      tag: 'test',
      topic: 'one',
    };
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.mintTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/mint')
      .send(req)
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.mintTokens).toHaveBeenCalledWith({
      amount: '1',
      message: {
        data: [
          {
            value: { content: 'This is a message' },
          },
        ],
        header: {
          tag: 'test',
          topics: ['one'],
          type: 'transfer_private',
        },
        group: {
          members: [{ identity: 'alpha' }, { identity: 'beta' }],
        },
      },
      pool: 'my-pool',
      tokenIndex: undefined,
    });
  });

  test('Mint tokens with broadcast blob', async () => {
    const data = {
      id: 'data1',
    } as FireFlyDataResponse;
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.uploadDataBlob.mockResolvedValueOnce(data);
    mockFireFly.mintTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/mintblob')
      .field('pool', 'test-pool')
      .field('amount', '10000')
      .field('tokenIndex', '')
      .field('to', '')
      .field('messagingMethod', 'broadcast')
      .attach('file', 'test/data/simple-file.txt')
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.uploadDataBlob).toHaveBeenCalledWith(expect.any(Buffer), {
      filename: 'simple-file.txt',
    });
    expect(mockFireFly.mintTokens).toHaveBeenCalledWith({
      amount: '10000',
      message: {
        data: [{ id: 'data1' }],
        header: { tag: undefined, topics: undefined, type: 'transfer_broadcast' },
      },
      pool: 'test-pool',
      tokenIndex: '',
    });
  });

  test('Mint tokens with private blob', async () => {
    const data = {
      id: 'data1',
    } as FireFlyDataResponse;
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.uploadDataBlob.mockResolvedValueOnce(data);
    mockFireFly.mintTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/mintblob')
      .field('pool', 'test-pool')
      .field('amount', '10000')
      .field('tokenIndex', '')
      .field('to', '')
      .field('messagingMethod', 'private')
      .field('recipients[]', 'alpha')
      .field('recipients[]', 'beta')
      .attach('file', 'test/data/simple-file.txt')
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.uploadDataBlob).toHaveBeenCalledWith(expect.any(Buffer), {
      filename: 'simple-file.txt',
    });
    expect(mockFireFly.mintTokens).toHaveBeenCalledWith({
      amount: '10000',
      message: {
        data: [{ id: 'data1' }],
        group: { members: [{ identity: 'alpha' }, { identity: 'beta' }] },
        header: { tag: undefined, topics: undefined, type: 'transfer_private' },
      },
      pool: 'test-pool',
      tokenIndex: '',
    });
  });

  test('Burn tokens', async () => {
    const req: TokenMintBurn = {
      pool: 'my-pool',
      amount: '1',
      recipients: null,
    };
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.burnTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/burn')
      .send(req)
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.burnTokens).toHaveBeenCalledWith({
      pool: 'my-pool',
      amount: '1',
    });
  });

  test('Burn tokens with broadcast message', async () => {
    const req: TokenMintBurn = {
      pool: 'my-pool',
      amount: '1',
      recipients: null,
      messagingMethod: 'broadcast',
      value: 'hello',
      tag: 'test',
      topic: 'one',
    };
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.burnTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/burn')
      .send(req)
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.burnTokens).toHaveBeenCalledWith({
      amount: '1',
      message: {
        data: [
          {
            value: 'hello',
          },
        ],
        header: {
          tag: 'test',
          topics: ['one'],
          type: 'transfer_broadcast',
        },
      },
      pool: 'my-pool',
      tokenIndex: undefined,
    });
  });

  test('Burn tokens with broadcast JSON', async () => {
    const req: TokenMintBurn = {
      pool: 'my-pool',
      amount: '1',
      recipients: null,
      messagingMethod: 'broadcast',
      jsonValue: { content: 'This is a message' },
      tag: 'test',
      topic: 'one',
    };
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.burnTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/burn')
      .send(req)
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.burnTokens).toHaveBeenCalledWith({
      amount: '1',
      message: {
        data: [
          {
            value: { content: 'This is a message' },
          },
        ],
        header: {
          tag: 'test',
          topics: ['one'],
          type: 'transfer_broadcast',
        },
      },
      pool: 'my-pool',
      tokenIndex: undefined,
    });
  });

  test('Burn tokens with broadcast blob', async () => {
    const data = {
      id: 'data1',
    } as FireFlyDataResponse;
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.uploadDataBlob.mockResolvedValueOnce(data);
    mockFireFly.burnTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/burnblob')
      .field('pool', 'test-pool')
      .field('amount', '10000')
      .field('messagingMethod', 'broadcast')
      .attach('file', 'test/data/simple-file.txt')
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.uploadDataBlob).toHaveBeenCalledWith(expect.any(Buffer), {
      filename: 'simple-file.txt',
    });
    expect(mockFireFly.burnTokens).toHaveBeenCalledWith({
      amount: '10000',
      message: {
        data: [{ id: 'data1' }],
        header: { tag: undefined, topics: undefined, type: 'transfer_broadcast' },
      },
      pool: 'test-pool',
    });
  });

  test('Burn tokens with private blob', async () => {
    const data = {
      id: 'data1',
    } as FireFlyDataResponse;
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.uploadDataBlob.mockResolvedValueOnce(data);
    mockFireFly.burnTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/burnblob')
      .field('pool', 'test-pool')
      .field('amount', '10000')
      .field('messagingMethod', 'private')
      .field('recipients[]', 'alpha')
      .field('recipients[]', 'beta')
      .attach('file', 'test/data/simple-file.txt')
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.uploadDataBlob).toHaveBeenCalledWith(expect.any(Buffer), {
      filename: 'simple-file.txt',
    });
    expect(mockFireFly.burnTokens).toHaveBeenCalledWith({
      amount: '10000',
      message: {
        data: [{ id: 'data1' }],
        group: { members: [{ identity: 'alpha' }, { identity: 'beta' }] },
        header: { tag: undefined, topics: undefined, type: 'transfer_private' },
      },
      pool: 'test-pool',
      tokenIndex: undefined,
    });
  });

  test('Burn tokens with private message', async () => {
    const req: TokenMintBurn = {
      pool: 'my-pool',
      amount: '1',
      recipients: ['alpha', 'beta'],
      messagingMethod: 'private',
      value: 'hello',
      tag: 'test',
      topic: 'one',
    };
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.burnTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/burn')
      .send(req)
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.burnTokens).toHaveBeenCalledWith({
      amount: '1',
      message: {
        data: [
          {
            value: 'hello',
          },
        ],
        header: {
          tag: 'test',
          topics: ['one'],
          type: 'transfer_private',
        },
        group: {
          members: [{ identity: 'alpha' }, { identity: 'beta' }],
        },
      },
      pool: 'my-pool',
      tokenIndex: undefined,
    });
  });

  test('Burn tokens with private JSON', async () => {
    const req: TokenMintBurn = {
      pool: 'my-pool',
      amount: '1',
      recipients: ['alpha', 'beta'],
      messagingMethod: 'private',
      jsonValue: { content: 'This is a message' },
      tag: 'test',
      topic: 'one',
    };
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.burnTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/burn')
      .send(req)
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.burnTokens).toHaveBeenCalledWith({
      amount: '1',
      message: {
        data: [
          {
            value: { content: 'This is a message' },
          },
        ],
        header: {
          tag: 'test',
          topics: ['one'],
          type: 'transfer_private',
        },
        group: {
          members: [{ identity: 'alpha' }, { identity: 'beta' }],
        },
      },
      pool: 'my-pool',
      tokenIndex: undefined,
    });
  });

  test('Transfer tokens', async () => {
    const req: TokenTransfer = {
      pool: 'my-pool',
      amount: '1',
      to: '0x111',
      recipients: null,
    };
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.transferTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/transfer')
      .send(req)
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.transferTokens).toHaveBeenCalledWith({
      pool: 'my-pool',
      amount: '1',
      to: '0x111',
    });
  });

  test('Transfer tokens with broadcast message', async () => {
    const req: TokenTransfer = {
      pool: 'my-pool',
      amount: '1',
      to: '0x111',
      recipients: null,
      messagingMethod: 'broadcast',
      value: 'hello',
      tag: 'test',
      topic: 'one',
    };
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.transferTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/transfer')
      .send(req)
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.transferTokens).toHaveBeenCalledWith({
      amount: '1',
      message: {
        data: [
          {
            value: 'hello',
          },
        ],
        header: {
          tag: 'test',
          topics: ['one'],
          type: 'transfer_broadcast',
        },
      },
      pool: 'my-pool',
      to: '0x111',
      tokenIndex: undefined,
    });
  });

  test('Transfer tokens with broadcast JSON', async () => {
    const req: TokenTransfer = {
      pool: 'my-pool',
      amount: '1',
      to: '0x111',
      recipients: null,
      messagingMethod: 'broadcast',
      jsonValue: { content: 'This is a message' },
      tag: 'test',
      topic: 'one',
    };
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.transferTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/transfer')
      .send(req)
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.transferTokens).toHaveBeenCalledWith({
      amount: '1',
      message: {
        data: [
          {
            value: { content: 'This is a message' },
          },
        ],
        header: {
          tag: 'test',
          topics: ['one'],
          type: 'transfer_broadcast',
        },
      },
      pool: 'my-pool',
      to: '0x111',
      tokenIndex: undefined,
    });
  });

  test('Transfer tokens with private message', async () => {
    const req: TokenTransfer = {
      pool: 'my-pool',
      amount: '1',
      to: '0x111',
      recipients: ['alpha', 'beta'],
      messagingMethod: 'private',
      value: 'hello',
      tag: 'test',
      topic: 'one',
    };
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.transferTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/transfer')
      .send(req)
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.transferTokens).toHaveBeenCalledWith({
      amount: '1',
      message: {
        data: [
          {
            value: 'hello',
          },
        ],
        header: {
          tag: 'test',
          topics: ['one'],
          type: 'transfer_private',
        },
        group: {
          members: [{ identity: 'alpha' }, { identity: 'beta' }],
        },
      },
      pool: 'my-pool',
      to: '0x111',
      tokenIndex: undefined,
    });
  });

  test('Transfer tokens with private JSON', async () => {
    const req: TokenTransfer = {
      pool: 'my-pool',
      amount: '1',
      to: '0x111',
      recipients: ['alpha', 'beta'],
      messagingMethod: 'private',
      jsonValue: { content: 'This is a message' },
      tag: 'test',
      topic: 'one',
    };
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.transferTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/transfer')
      .send(req)
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.transferTokens).toHaveBeenCalledWith({
      amount: '1',
      message: {
        data: [
          {
            value: { content: 'This is a message' },
          },
        ],
        header: {
          tag: 'test',
          topics: ['one'],
          type: 'transfer_private',
        },
        group: {
          members: [{ identity: 'alpha' }, { identity: 'beta' }],
        },
      },
      pool: 'my-pool',
      to: '0x111',
      tokenIndex: undefined,
    });
  });

  test('Transfer tokens with broadcast blob', async () => {
    const data = {
      id: 'data1',
    } as FireFlyDataResponse;
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.uploadDataBlob.mockResolvedValueOnce(data);
    mockFireFly.transferTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/transferblob')
      .field('pool', 'test-pool')
      .field('amount', '10000')
      .field('to', '0x111')
      .field('messagingMethod', 'broadcast')
      .attach('file', 'test/data/simple-file.txt')
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.uploadDataBlob).toHaveBeenCalledWith(expect.any(Buffer), {
      filename: 'simple-file.txt',
    });
    expect(mockFireFly.transferTokens).toHaveBeenCalledWith({
      amount: '10000',
      message: {
        data: [{ id: 'data1' }],
        header: { tag: undefined, topics: undefined, type: 'transfer_broadcast' },
      },
      pool: 'test-pool',
      to: '0x111',
      tokenIndex: undefined,
    });
  });

  test('Transfer tokens with private blob', async () => {
    const data = {
      id: 'data1',
    } as FireFlyDataResponse;
    const transfer = {
      localId: 'transfer1',
      tx: { id: 'tx1' },
    } as FireFlyTokenTransferResponse;

    mockFireFly.uploadDataBlob.mockResolvedValueOnce(data);
    mockFireFly.transferTokens.mockResolvedValueOnce(transfer);

    await request(server)
      .post('/api/tokens/transferblob')
      .field('pool', 'test-pool')
      .field('amount', '10000')
      .field('to', '0x111')
      .field('recipients[]', 'alpha')
      .field('recipients[]', 'beta')
      .field('messagingMethod', 'private')
      .attach('file', 'test/data/simple-file.txt')
      .expect(202)
      .expect({ type: 'token_transfer', id: 'transfer1' });

    expect(mockFireFly.uploadDataBlob).toHaveBeenCalledWith(expect.any(Buffer), {
      filename: 'simple-file.txt',
    });
    expect(mockFireFly.transferTokens).toHaveBeenCalledWith({
      amount: '10000',
      message: {
        data: [{ id: 'data1' }],
        group: { members: [{ identity: 'alpha' }, { identity: 'beta' }] },
        header: { tag: undefined, topics: undefined, type: 'transfer_private' },
      },
      pool: 'test-pool',
      to: '0x111',
      tokenIndex: undefined,
    });
  });

  test('Get balances', async () => {
    const pool = {
      name: 'poolA',
      type: 'fungible',
      id: 'poolA',
    } as FireFlyTokenPoolResponse;
    const balances = [
      { key: '0x123', balance: '1', pool: 'poolA' },
    ] as FireFlyTokenBalanceResponse[];

    mockFireFly.getTokenPool.mockResolvedValueOnce(pool);
    mockFireFly.getTokenBalances.mockResolvedValueOnce(balances);

    await request(server)
      .get('/api/tokens/balances?pool=poolA&key=0x123')
      .expect(200)
      .expect([
        {
          key: '0x123',
          balance: '1',
          pool: {
            name: 'poolA',
            type: 'fungible',
            id: 'poolA',
            decimals: 0,
            dataSupport: true,
          },
        },
      ]);

    expect(mockFireFly.getTokenBalances).toHaveBeenCalledWith({
      pool: 'poolA',
      key: '0x123',
      balance: '>0',
    });
  });
});
