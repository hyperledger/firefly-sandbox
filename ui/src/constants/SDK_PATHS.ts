const API_PREFIX = process.env.REACT_APP_API_PREFIX || '/api';

export const SDK_PATHS = {
  // Common
  organizations: `${API_PREFIX}/common/organizations`,
  verifiers: `${API_PREFIX}/common/verifiers`,
  // Contracts
  contractsApi: `${API_PREFIX}/contracts/api`,
  contractsApiByName: (apiName: string) =>
    `${API_PREFIX}/contracts/api/${apiName}`,
  contractsInterface: `${API_PREFIX}/contracts/interface`,
  contractsListener: `${API_PREFIX}/contracts/listener`,
  contractsListenerByApiName: (apiName: string) =>
    `${API_PREFIX}/contracts/api/${apiName}/listener`,
  // Messages
  messagesBroadcast: `${API_PREFIX}/messages/broadcast`,
  messagesBroadcastBlob: `${API_PREFIX}/messages/broadcastblob`,
  messagesPrivate: `${API_PREFIX}/messages/private`,
  messagesPrivateBlob: `${API_PREFIX}/messages/privateblob`,
  messagesDatatypes: `${API_PREFIX}/datatypes`,
  messagesDatatypesByNameVersion: (name: string, version: string) =>
    `${API_PREFIX}/datatypes/${name}/${version}`,
  // Tokens
  tokensBalances: `${API_PREFIX}/tokens/balances`,
  tokensBurn: `${API_PREFIX}/tokens/burn`,
  tokensBurnWithBlob: `${API_PREFIX}/tokens/burnblob`,
  tokensMint: `${API_PREFIX}/tokens/mint`,
  tokensMintWithBlob: `${API_PREFIX}/tokens/mintblob`,
  tokensPools: `${API_PREFIX}/tokens/pools`,
  tokensTransfer: `${API_PREFIX}/tokens/transfer`,
  tokensTransferWithBlob: `${API_PREFIX}/tokens/transferblob`,
  // Templates
  template: (category: string, formID: string, isBlob?: boolean) =>
    `${API_PREFIX}/${category}/template/${formID}${isBlob ? 'blob' : ''}`,
};
