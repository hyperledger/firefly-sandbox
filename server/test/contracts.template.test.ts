import * as request from 'supertest';
import * as _ from 'underscore';
import server from '../src/server';
import { formatTemplate } from '../src/utils';

describe('Templates: Smart Contracts', () => {
  test('Contract interface', () => {
    return request(server)
      .get('/api/contracts/template/interface')
      .expect(200)
      .expect((resp) => {
        const compiled = _.template(resp.body);

        expect(
          compiled({
            format: 'abi',
            name: 'simple-storage',
            version: '1.0',
            schema: [{ name: 'method1' }, { name: 'event1' }],
            publish: undefined,
          }),
        ).toBe(
          formatTemplate(`
            const ffi = await firefly.generateContractInterface({
              name: 'simple-storage',
              version: '1.0',
              input: {
                abi: [{"name":" ... "event1"}],
              },
            });
            const result = await firefly.createContractInterface(ffi);
            return { type: 'message', id: result.message };
        `),
        );

        expect(
          compiled({
            format: 'ffi',
            schema: { methods: [{ name: 'method1' }] },
            publish: undefined,
          }),
        ).toBe(
          formatTemplate(`
            const ffi = {"methods" ... ethod1"}]};
            const result = await firefly.createContractInterface(ffi);
            return { type: 'message', id: result.message };
        `),
        );

        expect(
          compiled({
            format: 'ffi',
            schema: { methods: [{ name: 'method1' }] },
            publish: true,
          }),
        ).toBe(
          formatTemplate(`
            const ffi = {"methods" ... ethod1"}]};
            const result = await firefly.createContractInterface(ffi, { publish: true });
            return { type: 'message', id: result.message };
        `),
        );
      });
  });

  test('Contract API', () => {
    return request(server)
      .get('/api/contracts/template/api')
      .expect(200)
      .expect((resp) => {
        const compiled = _.template(resp.body);

        expect(
          compiled({
            name: 'api1',
            interfaceName: 'simple-storage',
            interfaceVersion: '1.0',
            address: '0x123',
            publish: undefined,
          }),
        ).toBe(
          formatTemplate(`
            const api = await firefly.createContractAPI({
              name: 'api1',
              interface: {
                name: 'simple-storage',
                version: '1.0',
              },
              location: {
                address: '0x123',
              },
            });
            return { type: 'message', id: api.message };
        `),
        );

        expect(
          compiled({
            name: 'api1',
            interfaceName: 'simple-storage',
            interfaceVersion: '1.0',
            address: '0x123',
            publish: false,
          }),
        ).toBe(
          formatTemplate(`
            const api = await firefly.createContractAPI({
              name: 'api1',
              interface: {
                name: 'simple-storage',
                version: '1.0',
              },
              location: {
                address: '0x123',
              },
            }, { publish: false });
            return { type: 'message', id: api.message };
        `),
        );
      });
  });

  test('Contract API - Fabric', () => {
    return request(server)
      .get('/api/contracts/template/api')
      .expect(200)
      .expect((resp) => {
        const compiled = _.template(resp.body);

        expect(
          compiled({
            name: 'api1',
            interfaceName: 'simple-storage',
            interfaceVersion: '1.0',
            chaincode: 'chaincode123',
            channel: 'channel123',
            address: undefined,
            publish: undefined,
          }),
        ).toBe(
          formatTemplate(`
            const api = await firefly.createContractAPI({
              name: 'api1',
              interface: {
                name: 'simple-storage',
                version: '1.0',
              },
              location: {
                chaincode: 'chaincode123',
                channel: 'channel123',
              },
            });
            return { type: 'message', id: api.message };
        `),
        );
      });
  });

  test('Contract Listener', () => {
    return request(server)
      .get('/api/contracts/template/listener')
      .expect(200)
      .expect((resp) => {
        const compiled = _.template(resp.body);

        expect(
          compiled({
            name: '',
            topic: 'app1',
            apiName: 'api1',
            eventPath: 'set',
            firstEvent: 'newest',
          }),
        ).toBe(
          formatTemplate(`
            const listener = await firefly.createContractAPIListener(
              'api1',
              'set',
              {
                topic: 'app1',
                options: {
                  firstEvent: 'newest',
                }
              },
            );
            return {
              name: listener.name,
              topic: listener.topic,
              address: listener.location.address,
            };
          `),
        );
      });
  });
});
