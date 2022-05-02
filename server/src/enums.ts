export enum FF_EVENTS {
  // Blockchain Event
  BLOCKCHAIN_EVENT_RECEIVED = 'blockchain_event_received',
  BLOCKCHAIN_INVOKE_OP_SUCCEEDED = 'blockchain_invoke_op_succeeded',
  BLOCKCHAIN_INVOKE_OP_FAILED = 'blockchain_invoke_op_failed',
  CONTRACT_API_CONFIRMED = 'contract_api_confirmed',
  CONTRACT_INTERFACE_CONFIRMED = 'contract_interface_confirmed',
  DATATYPE_CONFIRMED = 'datatype_confirmed',
  IDENTITY_CONFIRMED = 'identity_confirmed',
  IDENTITY_UPDATED = 'identity_updated',
  NS_CONFIRMED = 'namespace_confirmed',
  // Message/Definitions
  MSG_CONFIRMED = 'message_confirmed',
  MSG_REJECTED = 'message_rejected',
  TX_SUBMITTED = 'transaction_submitted',
  // Transfers
  TOKEN_POOL_CONFIRMED = 'token_pool_confirmed',
  TOKEN_POOL_OP_FAILED = 'token_pool_op_failed',
  TOKEN_APPROVAL_CONFIRMED = 'token_approval_confirmed',
  TOKEN_APPROVAL_OP_FAILED = 'token_approval_op_failed',
  TOKEN_TRANSFER_CONFIRMED = 'token_transfer_confirmed',
  TOKEN_TRANSFER_OP_FAILED = 'token_transfer_op_failed',
}

export enum FF_TX {
  NONE = 'none',
  // Blockchain Event
  CONTRACT_INVOKE = 'contract_invoke',
  //Message/Definitions
  BATCH_PIN = 'batch_pin',
  UNPINNED = 'unpinned',
  // Transfers
  TOKEN_APPROVAL = 'token_approval',
  TOKEN_POOL = 'token_pool',
  TOKEN_TRANSFER = 'token_transfer',
}
