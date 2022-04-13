import { FF_EVENTS } from '../ff_models/eventTypes';
import { FF_MESSAGES, MessageStatus } from '../ff_models/messageTypes';
import { FF_TX } from '../ff_models/transactionTypes';

export interface IApiStatus {
  status: number;
  statusText: string;
}

export interface IBatch {
  id: string;
  type: string;
  namespace: string;
  node?: string;
  author: string;
  key: string;
  group: null | string;
  created: string;
  hash: string;
  manifest: any;
  tx?: {
    type: string;
    id: string;
  };
  confirmed: string | null;
}

export interface IBlockchainEvent {
  id: string;
  sequence: number;
  source: string;
  namespace: string;
  name: string;
  protocolId: string;
  output?: any;
  info?: any;
  timestamp: string;
  tx: {
    type: string;
    id?: string;
  };
}

export interface IContractInterface {
  id: string;
  message: string;
  namespace: string;
  name: string;
  description: string;
  version: string;
}

export interface IContractApi {
  name: string;
  address: string;
  url: {
    openapi: string;
    ui: string;
  };
  events?: object[];
}


export interface IDatatype {
  id: string;
  message: string;
  validator: string;
  namespace: string;
  name: string;
  version: string;
  hash: string;
  created: string;
  value?: any;
}

export interface IEvent {
  id: string;
  sequence: number;
  type: FF_EVENTS;
  namespace: string;
  reference: string;
  created: string;
  tx: string;
  batch?: IBatch;
  blockchainEvent?: IBlockchainEvent;
  contractAPI?: IFireflyApi;
  contractInterface?: IContractInterface;
  datatype?: IDatatype;
  identity?: IOrganization;
  message?: IMessage;
  namespaceDetails?: INamespace;
  tokenApproval?: ITokenApproval;
  tokenPool?: ITokenPool;
  transaction?: ITransaction;
  tokenTransfer?: ITokenTransfer;
}

export interface IFireflyApi {
  id: string;
  namespace: string;
  interface: {
    id: string;
  };
  location?: {
    address?: string;
  };
  name: string;
  message: string;
  urls: {
    openapi: string;
    ui: string;
  };
}

export interface IMessage {
  header: {
    id: string;
    type: FF_MESSAGES;
    txtype: FF_TX;
    author: string;
    key: string;
    created: string;
    namespace: string;
    topics: string[];
    tag: string;
    datahash: string;
  };
  hash: string;
  batch: string;
  state: MessageStatus;
  confirmed: string;
  data: {
    id: string;
    hash: string;
  }[];
}

export interface INamespace {
  id: string;
  name: string;
  description: string;
  type: string;
  created: string;
  confirmed: string;
}

export interface ISelfIdentity {
  id: string;
  name: string;
  did: string;
  ethereum_address: string;
}

export interface INetworkIdentity {
  id: string;
  did: string;
  type: string;
  parent: string;
  namespace: string;
  name: string;
  profile?: any;
  messages: {
    claim: string;
    verification: string | null;
    update: string | null;
  };
  created: string;
  updated: string;
  verifiers: {
    type: string;
    value: string;
  }[];
}

export interface IOrganization {
  id: string;
  did: string;
  type: string;
  namespace: string;
  name: string;
  messages: {
    claim: string;
    verification: string | null;
    update: string | null;
  };
  created: string;
  updated: string;
}

export interface IStatus {
  node: {
    name: string;
    registered: boolean;
    id: string;
  };
  org: {
    name: string;
    registered: boolean;
    did: string;
    identity: string;
    id: string;
  };
  defaults: {
    namespace: string;
  };
}

export interface ITokenApproval {
  localId: string;
  pool: string;
  connector: string;
  key: string;
  operator: string;
  approved: boolean;
  namespace: string;
  protocolId: string;
  created: string;
  tx: {
    type: string;
    id?: string;
  };
  blockchainEvent: string;
}

export interface ITokenConnector {
  name: string;
}

export interface IVerifiers {
  did: string;
  type: string;
  value: string;
}

export interface IContractInterface {
  name: string;
  version: string;
}

export interface ITokenPool {
  id: string;
  type: string;
  namespace: string;
  name: string;
  standard: string;
  symbol?: string;
  protocolId: string;
  connector: string;
  message: string;
  state: 'confirmed' | 'pending';
  created: string;
  tx: {
    type: string;
    id?: string;
  };
}

export interface ITokenTransfer {
  type: 'mint' | 'transfer' | 'burn';
  localId: string;
  pool: string;
  uri: string;
  connector: string;
  namespace: string;
  key: string;
  from?: string;
  to?: string;
  amount: string;
  protocolId: string;
  message: string;
  messageHash: string;
  created: string;
  tx: {
    type: string;
    id?: string;
  };
  blockchainEvent: string;
}

export interface ITransaction {
  id: string;
  namespace: string;
  type: FF_TX;
  created: string;
  blockchainIds?: string[];
}
