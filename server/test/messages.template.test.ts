import * as request from 'supertest';
import * as _ from 'underscore';
import server from '../src/server';
import { formatTemplate } from '../src/utils';

describe('Templates: Messages', () => {
  test('Broadcast template', () => {
    return request(server)
      .get('/api/messages/template/broadcast')
      .expect(200)
      .expect((resp) => {
        const compiled = _.template(resp.body);

        expect(
          compiled({
            tag: '',
            topic: '',
            value: '',
            jsonValue: '',
            datatypename: '',
            datatypeversion: '',
          }),
        ).toBe(
          formatTemplate(`
            const message = await firefly.sendBroadcast({
              header: {
              },
              data: [
                { value: '' },
              ],
            });
            return { type: 'message', id: message.header.id };
        `),
        );

        expect(
          compiled({
            tag: 'test-tag',
            topic: 'test-topic',
            value: "'Hello'",
            jsonValue: '',
            datatypename: '',
            datatypeversion: '',
          }),
        ).toBe(
          formatTemplate(`
            const message = await firefly.sendBroadcast({
              header: {
                tag: 'test-tag',
                topics: ['test-topic'],
              },
              data: [
                { value: '\\'Hello\\'' },
              ],
            });
            return { type: 'message', id: message.header.id };
        `),
        );

        expect(
          compiled({
            tag: 'test-tag',
            topic: 'test-topic',
            value: '',
            jsonValue: { val1: 'foo', val2: 'bar' },
            datatypename: '',
            datatypeversion: '',
          }),
        ).toBe(
          formatTemplate(`
          const message = await firefly.sendBroadcast({
            header: {
              tag: 'test-tag',
              topics: ['test-topic'],
            },
            data: [
              {
                value: {"val1":"f ... l2":"bar"},
              },
            ],
          });
          return { type: 'message', id: message.header.id };
        `),
        );

        expect(
          compiled({
            tag: 'test-tag',
            topic: 'test-topic',
            value: '',
            jsonValue: { val1: 'foo', val2: 'bar' },
            datatypename: 'widget',
            datatypeversion: '1.0',
          }),
        ).toBe(
          formatTemplate(`
          const message = await firefly.sendBroadcast({
            header: {
              tag: 'test-tag',
              topics: ['test-topic'],
            },
            data: [
              {
                datatype: {
                  name: 'widget',
                  version: '1.0',
                },
                value: {"val1":"f ... l2":"bar"},
              },
            ],
          });
          return { type: 'message', id: message.header.id };
        `),
        );
      });
  });

  test('Broadcast blob template', () => {
    return request(server)
      .get('/api/messages/template/broadcastblob')
      .expect(200)
      .expect((resp) => {
        const compiled = _.template(resp.body);
        expect(
          compiled({
            tag: 'test-tag',
            topic: 'test-topic',
            filename: 'document.pdf',
          }),
        ).toBe(
          formatTemplate(`
            const data = await firefly.uploadDataBlob(
              file.buffer,
              'document.pdf',
            );
            const message = await firefly.sendBroadcast({
              header: {
                tag: 'test-tag',
                topics: ['test-topic'],
              },
              data: [{ id: data.id }],
            });
            return { type: 'message', id: message.header.id };
        `),
        );
      });
  });

  test('Private template', () => {
    return request(server)
      .get('/api/messages/template/private')
      .expect(200)
      .expect((resp) => {
        const compiled = _.template(resp.body);

        expect(
          compiled({
            tag: '',
            topic: '',
            value: '',
            jsonValue: '',
            recipients: [],
            datatypename: '',
            datatypeversion: '',
          }),
        ).toBe(
          formatTemplate(`
            const message = await firefly.sendPrivateMessage({
              header: {
              },
              group: {
                members: [
                ],
              },
              data: [
                { value: '' },
              ],
            });
            return { type: 'message', id: message.header.id };
        `),
        );

        expect(
          compiled({
            tag: 'test-tag',
            topic: 'test-topic',
            value: "'Hello'",
            jsonValue: '',
            recipients: ['alpha', 'beta'],
            datatypename: '',
            datatypeversion: '',
          }),
        ).toBe(
          formatTemplate(`
            const message = await firefly.sendPrivateMessage({
              header: {
                tag: 'test-tag',
                topics: ['test-topic'],
              },
              group: {
                members: [
                  { identity: 'alpha' },
                  { identity: 'beta' },
                ],
              },
              data: [
                { value: '\\'Hello\\'' },
              ],
            });
            return { type: 'message', id: message.header.id };
        `),
        );

        expect(
          compiled({
            tag: 'test-tag',
            topic: 'test-topic',
            value: '',
            jsonValue: { val1: 'foo', val2: 'bar' },
            recipients: ['alpha', 'beta'],
            datatypename: '',
            datatypeversion: '',
          }),
        ).toBe(
          formatTemplate(`
            const message = await firefly.sendPrivateMessage({
              header: {
                tag: 'test-tag',
                topics: ['test-topic'],
              },
              group: {
                members: [
                  { identity: 'alpha' },
                  { identity: 'beta' },
                ],
              },
              data: [
                {
                  value: {"val1":"f ... l2":"bar"}
                },
              ],
            });
            return { type: 'message', id: message.header.id };
        `),
        );

        expect(
          compiled({
            tag: 'test-tag',
            topic: 'test-topic',
            value: '',
            jsonValue: { val1: 'foo', val2: 'bar' },
            recipients: ['alpha', 'beta'],
            datatypename: 'widget',
            datatypeversion: '1.0',
          }),
        ).toBe(
          formatTemplate(`
            const message = await firefly.sendPrivateMessage({
              header: {
                tag: 'test-tag',
                topics: ['test-topic'],
              },
              group: {
                members: [
                  { identity: 'alpha' },
                  { identity: 'beta' },
                ],
              },
              data: [
                {
                  datatype: {
                    name: 'widget',
                    version: '1.0',
                  },
                  value: {"val1":"f ... l2":"bar"}
                },
              ],
            });
            return { type: 'message', id: message.header.id };
        `),
        );
      });
  });

  test('Private blob template', () => {
    return request(server)
      .get('/api/messages/template/privateblob')
      .expect(200)
      .expect((resp) => {
        const compiled = _.template(resp.body);
        expect(
          compiled({
            tag: 'test-tag',
            topic: 'test-topic',
            filename: 'document.pdf',
            recipients: ['alpha', 'beta'],
            datatypename: '',
            datatypeversion: '',
          }),
        ).toBe(
          formatTemplate(`
            const data = await firefly.uploadDataBlob(
              file.buffer,
              'document.pdf',
            );
            const message = await firefly.sendPrivateMessage({
              header: {
                tag: 'test-tag',
                topics: ['test-topic'],
              },
              group: {
                members: [
                  { identity: 'alpha' },
                  { identity: 'beta' },
                ],
              },
              data: [{ id: data.id }],
            });
            return { type: 'message', id: message.header.id };
        `),
        );
      });
  });

  test('Datatypes template', () => {
    return request(server)
      .get('/api/messages/template/datatypes')
      .expect(200)
      .expect((resp) => {
        const compiled = _.template(resp.body);

        expect(
          compiled({
            name: 'widget',
            version: '0.0.2',
            schema: {
              $id: 'https://example.com/widget.schema.json',
              $schema: 'https://json-schema.org/draft/2020-12/schema',
              title: 'Widget',
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'The unique identifier for the widget.',
                },
                name: {
                  type: 'string',
                  description: "The person's last name.",
                },
              },
            },
          }),
        ).toBe(
          formatTemplate(`
            const datatype = await firefly.createDatatype({
              name: 'widget',
              version: '0.0.2',
            }, {"$id":"ht ...  name."}}});
            return { type: 'datatype', id: datatype.id };
        `),
        );
      });
  });
});
