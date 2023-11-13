import * as request from 'supertest';
import FireFly, {
  FireFlyContractAPIResponse,
  FireFlyContractInterfaceResponse,
  FireFlyContractListenerResponse,
} from '@hyperledger/firefly-sdk';
import server from '../src/server';
import { getFireflyClient } from '../src/clients/fireflySDKWrapper';
import {
  ContractAPI,
  ContractInterface,
  ContractInterfaceFormat,
  ContractListener,
} from '../src/interfaces';
const firefly = getFireflyClient();
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
    } as FireFlyContractInterfaceResponse;

    mockFireFly.createContractInterface.mockResolvedValueOnce(int);

    await request(server)
      .post('/api/contracts/interface')
      .send(req)
      .expect(202)
      .expect({ type: 'message', id: 'msg1' });

    expect(mockFireFly.createContractInterface).toHaveBeenCalledWith(req.schema, { publish: true });
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
    } as FireFlyContractInterfaceResponse;

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
    expect(mockFireFly.createContractInterface).toHaveBeenCalledWith(int, { publish: true });
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
    } as FireFlyContractAPIResponse;

    mockFireFly.createContractAPI.mockResolvedValueOnce(api);

    await request(server)
      .post('/api/contracts/api')
      .send(req)
      .expect(202)
      .expect({ type: 'message', id: 'msg1' });

    expect(mockFireFly.createContractAPI).toHaveBeenCalledWith(
      {
        interface: { name: 'my-contract', version: '1.0' },
        location: { address: '0x123' },
        name: 'my-api',
      },
      {
        publish: true,
      },
    );
  });

  test('Create contract API with Fabric', async () => {
    const req: ContractAPI = {
      name: 'my-api-fabric',
      channel: '0x123',
      chaincode: 'chaincode',
      interfaceName: 'my-contract',
      interfaceVersion: '1.0',
    };
    const api = {
      name: 'my-api-fabric',
      message: 'msg1',
    } as FireFlyContractAPIResponse;

    mockFireFly.createContractAPI.mockResolvedValueOnce(api);

    await request(server)
      .post('/api/contracts/apifabric')
      .send(req)
      .expect(202)
      .expect({ type: 'message', id: 'msg1' });

    expect(mockFireFly.createContractAPI).toHaveBeenCalledWith(
      {
        interface: { name: 'my-contract', version: '1.0' },
        location: { chaincode: 'chaincode', channel: '0x123' },
        name: 'my-api-fabric',
      },
      {
        publish: true,
      },
    );
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
    ] as FireFlyContractInterfaceResponse[];

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
    } as FireFlyContractAPIResponse;
    const int = {
      name: 'my-contract',
      version: '1.0',
      message: 'msg1',
    } as FireFlyContractInterfaceResponse;

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
    } as FireFlyContractAPIResponse;
    const listener = {
      id: 'listener1',
      topic: 'my-app',
      location: { address: '0x123' },
      event: { name: 'event1' },
    } as FireFlyContractListenerResponse;

    mockFireFly.getContractAPI.mockResolvedValueOnce(api);
    mockFireFly.getContractListeners.mockResolvedValueOnce([listener]);

    await request(server)
      .get('/api/contracts/api/my-api/listener')
      .expect(200)
      .expect([
        {
          id: 'listener1',
          topic: 'my-app',
          address: '0x123',
          eventName: 'event1',
        },
      ]);

    expect(mockFireFly.getContractListeners).toHaveBeenCalledWith({ interface: 'int1' });
  });

  test('Create contract listener', async () => {
    const req: ContractListener = {
      apiName: 'my-api',
      eventPath: 'Changed',
      topic: 'my-app',
      firstEvent: 'newest',
    };
    const listener = {
      id: 'listener1',
      topic: 'my-app',
      location: '0x123',
      event: { name: 'Changed' },
    } as FireFlyContractListenerResponse;

    mockFireFly.createContractAPIListener.mockResolvedValueOnce(listener);

    await request(server).post('/api/contracts/listener').send(req).expect(200).expect({
      id: 'listener1',
      topic: 'my-app',
      address: '0x123',
      eventName: 'Changed',
    });

    expect(mockFireFly.createContractAPIListener).toHaveBeenCalledWith('my-api', 'Changed', {
      topic: 'my-app',
      options: {
        firstEvent: 'newest',
      },
    });
  });
});
