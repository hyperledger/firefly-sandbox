import * as request from 'supertest';
import FireFly, { FireFlyContractAPI, FireFlyContractInterface } from '@photic/firefly-sdk-nodejs';
import server from '../src/server';
import { firefly } from '../src/clients/firefly';
import { ContractAPI, ContractInterface, ContractInterfaceFormat } from '../src/interfaces';

jest.mock('@photic/firefly-sdk-nodejs');
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
});
