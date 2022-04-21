export const SDK_PATHS = {
  // Common
  organizations: '/api/common/organizations',
  verifiers: '/api/common/verifiers',
  // Contracts
  contractsApi: '/api/contracts/api',
  contractsApiByName: (apiName: string) => `/api/contracts/api/${apiName}`,
  contractsInterface: '/api/contracts/interface',
  contractsListener: '/api/contracts/listener',
  contractsListenerByApiName: (apiName: string) =>
    `/api/contracts/api/${apiName}/listener`,
  // Messages
  messagesBroadcast: '/api/messages/broadcast',
  messagesBroadcastBlob: '/api/messages/broadcastblob',
  messagesPrivate: '/api/messages/private',
  messagesPrivateBlob: '/api/messages/privateblob',
  messagesDatatypes: '/api/datatypes',
  messagesDatatypesByNameVersion: (name: string, version: string) =>
    `/api/datatypes/${name}/${version}`,
  // Tokens
  tokensBalances: '/api/tokens/balances',
  tokensBurn: '/api/tokens/burn',
  tokensMint: '/api/tokens/mint',
  tokensPools: '/api/tokens/pools',
  tokensTransfer: '/api/tokens/transfer',
  // Templates
  template: (category: string, formID: string) =>
    `/api/${category}/template/${formID}`,
};
