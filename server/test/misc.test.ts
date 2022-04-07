import * as request from 'supertest';
import server from '../src/server';

describe('Misc', () => {
  test('Swagger UI', () => {
    return request(server).get('/api').redirects(1).expect(200);
  });
});
