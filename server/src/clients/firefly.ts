import FireFly from '@hyperledger/firefly-sdk';
import { InternalServerError } from 'routing-controllers';

export const firefly = new FireFly({
  host: process.env.FF_ENDPOINT || 'http://localhost:5000',
  namespace: process.env.FF_DEFAULT_NAMESPACE || 'default',
});

firefly.onError((err) => {
  throw new InternalServerError(err.message);
});
