import * as request from 'supertest';
import * as _ from 'underscore';
import server from '../src/server';
import { formatTemplate } from '../src/utils';

describe('Templates: Datatypes', () => {
  test('Datatypes template', () => {
    return request(server)
      .get('/api/datatypes/template')
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
              name:  'widget',
              version: '0.0.2',
            },  {"$id":"ht ...  name."}}}) ;
            return { type: 'datatype', id: datatype.id };
        `),
        );
      });
  });
});
