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
  tokensBurnWithBlob: '/api/tokens/burnblob',
  tokensMint: '/api/tokens/mint',
  tokensMintWithBlob: '/api/tokens/mintblob',
  tokensPools: '/api/tokens/pools',
  tokensTransfer: '/api/tokens/transfer',
  tokensTransferWithBlob: '/api/tokens/transferblob',
  // Templates
  template: (category: string, formID: string, isBlob?: boolean) =>
    `/api/${category}/template/${formID}${isBlob ? 'blob' : ''}`,
};
