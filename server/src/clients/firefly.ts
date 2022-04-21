import FireFly from '@hyperledger/firefly-sdk';
import { InternalServerError } from 'routing-controllers';

export const firefly = new FireFly({
  host: process.env.FF_ENDPOINT || 'http://localhost:5000',
});

firefly.onError((err) => {
  throw new InternalServerError(err.message);
});
