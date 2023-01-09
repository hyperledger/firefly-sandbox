import FireFly from '@hyperledger/firefly-sdk';
import { InternalServerError } from 'routing-controllers';

const fireflySDKs = {};

export const getFireflyClient = (namespace: string = 'default') => {
  if (!fireflySDKs[namespace]) {
    fireflySDKs[namespace] = new FireFly({
      host: process.env.FF_ENDPOINT || 'http://localhost:5000',
      namespace,
    });
    fireflySDKs[namespace].onError((err) => {
      throw new InternalServerError(err.message);
    });
  }
  return fireflySDKs[namespace];
};
