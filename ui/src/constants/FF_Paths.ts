export const FF_Paths = {
  apiPrefix: '/api/v1',
  nsPrefix: '/api/v1/namespaces',
  // APIs
  apis: '/apis',
  apisByName: (apiName: string) => `/apis/${apiName}`,
  apisInvoke: (apiName: string, methodPath: string) =>
    `/apis/${apiName}/invoke/${methodPath}`,
  apisQuery: (apiName: string, methodPath: string) =>
    `/apis/${apiName}/query/${methodPath}`,
  apisSubscribe: (apiName: string, methodPath: string) =>
    `/apis/${apiName}/subscribe/${methodPath}`,
  apisById: (id: string) => `/apis/${id}`,
  // Batches
  batches: '/batches',
  batchesByBatchId: (batchId: string) => `/batches/${batchId}`,
  // Blockchain Events
  blockchainEvents: '/blockchainevents',
  blockchainEventsById: (id: string) => `/blockchainevents/${id}`,
  // Charts
  chartsHistogram: (
    collection: string,
    startTime: number,
    endTime: number,
    numBuckets: number
  ) =>
    `/charts/histogram/${collection}?startTime=${startTime}&endTime=${endTime}&buckets=${numBuckets}`,
  // Contracts
  contractInterfaces: '/contracts/interfaces',
  contractInterfacesById: (id: string) => `/contracts/interfaces/${id}`,
  contractInterfacesInvoke: (interfaceId: string, methodPath: string) =>
    `/contracts/interfaces/${interfaceId}/invoke/${methodPath}`,
  contractInterfacesQuery: (interfaceId: string, methodPath: string) =>
    `/contracts/interfaces/${interfaceId}/query/${methodPath}`,
  contractInterfacesSubscribe: (interfaceId: string, eventPath: string) =>
    `/contracts/interfaces/${interfaceId}/query/${eventPath}`,
  contractInterfacesByNameVersion: (name: string, version: string) =>
    `/contracts/interfaces/${name}/${version}`,
  contractInvoke: '/contracts/invoke',
  contractQuery: '/contracts/query',
  contractListeners: '/contracts/listeners',
  contractListenersByNameId: (nameOrId: string) =>
    `/contracts/listeners/${nameOrId}`,
  // Data
  data: '/data',
  dataById: (id: string) => `/data/${id}`,
  dataBlobById: (id: string) => `/data/${id}/blob`,
  dataMessagesById: (id: string) => `/data/${id}/messages`,
  // Datatype
  datatypes: '/datatypes',
  datatypesByNameVersion: (name: string, version: string) =>
    `/datatypes/${name}/${version}`,
  events: '/events',
  eventsById: (eventId: string) => `/events/${eventId}`,
  // Groups
  groups: '/groups',
  groupsById: (groupId: string) => `/groups/${groupId}`,
  // Identities
  identities: '/identities',
  identitiesById: (identityID: string) => `/identities/${identityID}`,
  // Messages
  messages: '/messages',
  broadcast: '/api/messages/broadcast',
  broadcastblob: '/api/messages/broadcastblob',
  private: '/api/messages/private',
  privateblob: '/api/messages/privateblob',
  messagesReqReply: '/messages/requestreply',
  messagesById: (msgId: string) => `/messages/${msgId}`,
  messageDataById: (msgId: string) => `/messages/${msgId}/data`,
  messageEventsById: (msgId: string) => `/messages/${msgId}/events`,
  messageOpsById: (msgId: string) => `/messages/${msgId}/operations`,
  messageTxById: (msgId: string) => `/messages/${msgId}/transaction`,
  // Operations
  operations: '/operations',
  operationsById: (opId: string) => `/operations/${opId}`,
  // Subscriptions
  subscriptions: '/subscriptions',
  subscriptionsById: (subId: string) => `/subscriptions/${subId}`,
  // Tokens
  tokens: '/tokens',
  tokenAccounts: '/tokens/accounts',
  tokenAccountPoolsByKey: (key: string) => `/tokens/accounts/${key}/pools`,
  tokenBalances: '/api/tokens/balances',
  burn: '/api/tokens/burn',
  tokenConnectors: '/tokens/connectors',
  mint: '/api/tokens/mint',
  pools: '/api/tokens/pools',
  tokenPoolsById: (nameOrId: string) => `/tokens/pools/${nameOrId}`,
  transfer: '/api/tokens/transfer',
  tokenTransferById: (transferId: string) => `/tokens/transfers/${transferId}`,
  verifiers: '/api/common/verifiers',
  // Transactions
  transactions: '/transactions',
  transactionById: (txId: string) => `/transactions/${txId}`,
  transactionByIdBlockchainEvents: (txId: string) =>
    `/transactions/${txId}/blockchainevents`,
  transactionByIdOperations: (txId: string) =>
    `/transactions/${txId}/operations`,
  transactionByIdStatus: (txId: string) => `/transactions/${txId}/status`,
  // Identities
  networkIdentities: '/network/identities',
  // Network
  networkNodes: '/network/nodes',
  networkNodeById: (id: string) => `/network/nodes/${id}`,
  networkNodeSelf: '/network/self',
  networkOrgs: '/network/organizations',
  networkOrgById: (id: string) => `/network/organizations/${id}`,
  networkOrgSelf: '/network/organizations/self',
  // Status
  status: '/status',
  statusBatchManager: '/status/batchmanager',
};
