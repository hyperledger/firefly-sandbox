import FireFly from '@hyperledger/firefly-sdk';

export const firefly = new FireFly({
  host: process.env.FF_ENDPOINT || 'http://localhost:5000',
});
