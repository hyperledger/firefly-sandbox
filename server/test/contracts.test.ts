import * as request from 'supertest';
import FireFly, {
  FireFlyContractAPI,
  FireFlyContractInterface,
  FireFlyContractListener,
} from '@hyperledger/firefly-sdk';
import server from '../src/server';
import { firefly } from '../src/clients/firefly';
import {
  ContractAPI,
  ContractInterface,
  ContractInterfaceFormat,
  ContractListener,
} from '../src/interfaces';

jest.mock('@hyperledger/firefly-sdk');
const mockFireFly = firefly as jest.MockedObject<FireFly>;

describe('Smart Contracts', () => {
  test('Create contract interface from FFI', async () => {
    const req: ContractInterface = {
      format: ContractInterfaceFormat.FFI,
      schema: {
        name: 'my-contract',
        version: '1.0',
        methods: [{ name: 'method1' }],
        events: [{ name: 'event1' }],
      },
    };
    const int = {
      name: 'my-contract',
      version: '1.0',
      message: 'msg1',
    } as FireFlyContractInterface;

    mockFireFly.createContractInterface.mockResolvedValueOnce(int);

    await request(server)
      .post('/api/contracts/interface')
      .send(req)
      .expect(202)
      .expect({ type: 'message', id: 'msg1' });

    expect(mockFireFly.createContractInterface).toHaveBeenCalledWith(req.schema);
  });

  test('Create contract interface from ABI', async () => {
    const req: ContractInterface = {
      format: ContractInterfaceFormat.ABI,
      name: 'my-contract',
      version: '1.0',
      schema: [{ name: 'method1' }, { name: 'event1' }],
    };
    const int = {
      name: 'my-contract',
      version: '1.0',
      message: 'msg1',
    } as FireFlyContractInterface;

    mockFireFly.generateContractInterface.mockResolvedValueOnce(int);
    mockFireFly.createContractInterface.mockResolvedValueOnce(int);

    await request(server)
      .post('/api/contracts/interface')
      .send(req)
      .expect(202)
      .expect({ type: 'message', id: 'msg1' });

    expect(mockFireFly.generateContractInterface).toHaveBeenCalledWith({
      name: 'my-contract',
      version: '1.0',
      input: { abi: req.schema },
    });
    expect(mockFireFly.createContractInterface).toHaveBeenCalledWith(int);
  });

  test('Create contract API', async () => {
    const req: ContractAPI = {
      name: 'my-api',
      address: '0x123',
      interfaceName: 'my-contract',
      interfaceVersion: '1.0',
    };
    const api = {
      name: 'my-api',
      message: 'msg1',
    } as FireFlyContractAPI;

    mockFireFly.createContractAPI.mockResolvedValueOnce(api);

    await request(server)
      .post('/api/contracts/api')
      .send(req)
      .expect(202)
      .expect({ type: 'message', id: 'msg1' });

    expect(mockFireFly.createContractAPI).toHaveBeenCalledWith({
      interface: { name: 'my-contract', version: '1.0' },
      location: { address: '0x123' },
      name: 'my-api',
    });
  });
  test('Get contract Interfaces', async () => {
    const int = [
      {
        name: 'my-contract',
        description: '',
        version: '1.0',
      },
      {
        name: 'my-contract',
        description: '',
        version: '1.1',
      },
    ] as FireFlyContractInterface[];

    mockFireFly.getContractInterfaces.mockResolvedValueOnce(int);

    await request(server).get('/api/contracts/interface').expect(200).expect(int);
  });

  test('Get contract API', async () => {
    const api = {
      name: 'my-api',
      message: 'msg1',
      interface: {
        id: 'int1',
      },
      urls: {
        openapi: 'openapi-url',
        ui: 'ui-url',
      },
    } as FireFlyContractAPI;
    const int = {
      name: 'my-contract',
      version: '1.0',
      message: 'msg1',
    } as FireFlyContractInterface;

    mockFireFly.getContractAPI.mockResolvedValueOnce(api);
    mockFireFly.getContractInterface.mockResolvedValueOnce(int);

    await request(server)
      .get('/api/contracts/api/my-api')
      .expect(200)
      .expect({
        name: 'my-api',
        urls: {
          openapi: 'openapi-url',
          ui: 'ui-url',
        },
      });

    expect(mockFireFly.getContractAPI).toHaveBeenCalledWith('my-api');
    expect(mockFireFly.getContractInterface).toHaveBeenCalledWith('int1', true);
  });

  test('Get contract listeners', async () => {
    const api = {
      name: 'my-api',
      message: 'msg1',
      interface: {
        id: 'int1',
      },
      urls: {
        openapi: 'openapi-url',
        ui: 'ui-url',
      },
    } as FireFlyContractAPI;
    const listener = {
      name: 'listener1',
      topic: 'my-app',
      location: { address: '0x123' },
    } as FireFlyContractListener;

    mockFireFly.getContractAPI.mockResolvedValueOnce(api);
    mockFireFly.getContractListeners.mockResolvedValueOnce([listener]);

    await request(server)
      .get('/api/contracts/api/my-api/listener')
      .expect(200)
      .expect([
        {
          name: 'listener1',
          topic: 'my-app',
          address: '0x123',
        },
      ]);

    expect(mockFireFly.getContractListeners).toHaveBeenCalledWith({ interface: 'int1' });
  });

  test('Create contract listener', async () => {
    const req: ContractListener = {
      apiName: 'my-api',
      eventPath: 'Changed',
      topic: 'my-app',
    };
    const listener = {
      name: 'listener1',
      topic: 'my-app',
      location: { address: '0x123' },
    } as FireFlyContractListener;

    mockFireFly.createContractAPIListener.mockResolvedValueOnce(listener);

    await request(server).post('/api/contracts/listener').send(req).expect(200).expect({
      name: 'listener1',
      topic: 'my-app',
      address: '0x123',
    });

    expect(mockFireFly.createContractAPIListener).toHaveBeenCalledWith('my-api', 'Changed', {
      topic: 'my-app',
    });
  });
});
