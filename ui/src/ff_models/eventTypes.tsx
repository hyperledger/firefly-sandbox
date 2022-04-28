import { t } from 'i18next';
import { FFListText } from '../components/Lists/FFListText';
import { HashPopover } from '../components/Popovers/HashPopover';
import { IEvent } from '../interfaces/api';
import { IDataListItem } from '../interfaces/ff';
import { FFColors } from '../theme';

export interface IHistEventBucket {
  [EventCategoryEnum.BLOCKCHAIN]: number;
  [EventCategoryEnum.MESSAGES]: number;
  [EventCategoryEnum.TOKENS]: number;
}

export interface IHistEventTimeMap {
  [key: string]: IHistEventBucket;
}

export enum EventCategoryEnum {
  BLOCKCHAIN = 'Blockchain',
  MESSAGES = 'Messages',
  TOKENS = 'Tokens',
}

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

interface IEventCategory {
  category: string;
  color: string;
  enrichedEventKey: string;
  eventKeyList: (event: IEvent) => IDataListItem[];
  nicename: string;
}

export const FF_EVENTS_CATEGORY_MAP: {
  [key in FF_EVENTS]: IEventCategory;
} = {
  // Blockchain Events
  [FF_EVENTS.BLOCKCHAIN_EVENT_RECEIVED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'blockchainEventReceived',
    enrichedEventKey: 'blockchainEvent',
    eventKeyList: (event: IEvent): IDataListItem[] => [
      {
        label: t('blockchainEventID') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.blockchainEvent?.id ?? t('---')}
          />
        ),
      },
      {
        label: t('name') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.blockchainEvent?.name ?? t('---')}
          />
        ),
      },
      {
        label: t('protocolID') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.blockchainEvent?.protocolId ?? t('---')}
          />
        ),
      },
    ],
  },
  [FF_EVENTS.BLOCKCHAIN_INVOKE_OP_SUCCEEDED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'blockchainInvokeSucceeded',
    enrichedEventKey: 'operation',
    eventKeyList: (event: IEvent): IDataListItem[] => [
      {
        label: t('operationID') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.operation?.id ?? t('---')}
          />
        ),
      },
    ],
  },
  [FF_EVENTS.BLOCKCHAIN_INVOKE_OP_FAILED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'blockchainInvokeFailed',
    enrichedEventKey: 'operation',
    eventKeyList: (event: IEvent): IDataListItem[] => [
      {
        label: t('operationErrorID') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.operation?.id ?? t('---')}
          />
        ),
      },
      {
        label: t('operationError') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.operation?.error ?? t('---')}
          />
        ),
      },
    ],
  },
  [FF_EVENTS.CONTRACT_API_CONFIRMED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'contractApiConfirmed',
    enrichedEventKey: 'contractAPI',
    eventKeyList: (event: IEvent): IDataListItem[] => [
      {
        label: t('apiID') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.contractAPI?.id ?? t('---')}
          />
        ),
      },
      {
        label: t('name') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.contractAPI?.name ?? t('---')}
          />
        ),
      },
    ],
  },
  [FF_EVENTS.CONTRACT_INTERFACE_CONFIRMED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'contractInterfaceConfirmed',
    enrichedEventKey: 'contractInterface',
    eventKeyList: (event: IEvent): IDataListItem[] => [
      {
        label: t('interfaceID') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.contractInterface?.id ?? t('---')}
          />
        ),
      },
      {
        label: t('name') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.contractInterface?.name ?? t('---')}
          />
        ),
      },
      {
        label: t('version') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.contractInterface?.version ?? t('---')}
          />
        ),
      },
    ],
  },
  [FF_EVENTS.DATATYPE_CONFIRMED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'datatypeConfirmed',
    enrichedEventKey: 'datatype',
    eventKeyList: (event: IEvent): IDataListItem[] => [
      {
        label: t('datatypeID') + ':',
        value: (
          <FFListText color="secondary" text={event.datatype?.id ?? t('---')} />
        ),
      },
      {
        label: t('name') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.datatype?.name ?? t('---')}
          />
        ),
      },
      {
        label: t('version') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.datatype?.version ?? t('---')}
          />
        ),
      },
    ],
  },
  [FF_EVENTS.IDENTITY_CONFIRMED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'identityConfirmed',
    enrichedEventKey: 'identity',
    eventKeyList: (event: IEvent): IDataListItem[] => [
      {
        label: t('identityID') + ':',
        value: (
          <FFListText color="secondary" text={event.identity?.id ?? t('---')} />
        ),
      },
      {
        label: t('did') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.identity?.did ?? t('---')}
          />
        ),
      },
    ],
  },
  [FF_EVENTS.IDENTITY_UPDATED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'identityUpdated',
    enrichedEventKey: 'identity',
    eventKeyList: (event: IEvent): IDataListItem[] => [
      {
        label: t('identityID') + ':',
        value: (
          <FFListText color="secondary" text={event.identity?.id ?? t('---')} />
        ),
      },
      {
        label: t('did') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.identity?.did ?? t('---')}
          />
        ),
      },
    ],
  },
  [FF_EVENTS.NS_CONFIRMED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'namespaceConfirmed',
    enrichedEventKey: 'namespaceDetails',
    eventKeyList: (event: IEvent): IDataListItem[] => [
      {
        label: t('namespaceID') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.namespaceDetails?.id ?? t('---')}
          />
        ),
      },
      {
        label: t('name') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.namespaceDetails?.name ?? t('---')}
          />
        ),
      },
    ],
  },
  // Message Events
  [FF_EVENTS.MSG_CONFIRMED]: {
    category: EventCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'messageConfirmed',
    enrichedEventKey: 'message',
    eventKeyList: (event: IEvent): IDataListItem[] => [
      {
        label: t('messageID') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.message?.header.id ?? t('---')}
          />
        ),
      },
      {
        label: t('messageType') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.message?.header.type ?? t('---')}
          />
        ),
      },
      {
        label: t('tag') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.message?.header.tag ?? t('---')}
          />
        ),
      },
      {
        label: t('topic') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.message?.header.topics.toString() ?? t('---')}
          />
        ),
      },
    ],
  },
  [FF_EVENTS.MSG_REJECTED]: {
    category: EventCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'messageRejected',
    enrichedEventKey: 'message',
    eventKeyList: (event: IEvent): IDataListItem[] => [
      {
        label: t('messageID') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.message?.header.id ?? t('---')}
          />
        ),
      },
      {
        label: t('messageType') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.message?.header.type ?? t('---')}
          />
        ),
      },
      {
        label: t('tag') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.message?.header.tag ?? t('---')}
          />
        ),
      },
      {
        label: t('topic') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.message?.header.topics.toString() ?? t('---')}
          />
        ),
      },
    ],
  },
  [FF_EVENTS.TX_SUBMITTED]: {
    category: EventCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'transactionSubmitted',
    enrichedEventKey: 'transaction',
    eventKeyList: (event: IEvent): IDataListItem[] => [
      {
        label: t('transactionID') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.transaction?.id ?? t('---')}
          />
        ),
      },
      {
        label: t('type') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.transaction?.type ?? t('---')}
          />
        ),
      },
      {
        label: event.batch ? t('batchMessages') + ':' : '',
        value: event.batch ? (
          <>
            {event.batch.manifest.messages.map(
              (m: { hash: string; id: string }, idx: number) => (
                <HashPopover key={idx} shortHash address={m.id} />
              )
            )}
          </>
        ) : (
          <></>
        ),
      },
    ],
  },
  // Token Events
  [FF_EVENTS.TOKEN_POOL_CONFIRMED]: {
    category: EventCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenPoolConfirmed',
    enrichedEventKey: 'tokenPool',
    eventKeyList: (event: IEvent): IDataListItem[] => [
      {
        label: t('poolID') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.tokenPool?.id ?? t('---')}
          />
        ),
      },
      {
        label: t('name') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.tokenPool?.name ?? t('---')}
          />
        ),
      },
      {
        label: t('symbol') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.tokenPool?.symbol ?? t('---')}
          />
        ),
      },
      {
        label: t('standard') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.tokenPool?.standard ?? t('---')}
          />
        ),
      },
      {
        label: t('type') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.tokenPool?.type ?? t('---')}
          />
        ),
      },
    ],
  },
  [FF_EVENTS.TOKEN_POOL_OP_FAILED]: {
    category: EventCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenPoolFailed',
    enrichedEventKey: 'operation',
    eventKeyList: (event: IEvent): IDataListItem[] => [
      {
        label: t('operationErrorID') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.operation?.id ?? t('---')}
          />
        ),
      },
      {
        label: t('poolID') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.operation?.correlator ?? t('---')}
          />
        ),
      },
      {
        label: t('operationError') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.operation?.error ?? t('---')}
          />
        ),
      },
    ],
  },
  [FF_EVENTS.TOKEN_APPROVAL_CONFIRMED]: {
    category: EventCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenApprovalConfirmed',
    enrichedEventKey: 'tokenApproval',
    eventKeyList: (event: IEvent): IDataListItem[] => [
      {
        label: t('approvalID') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.tokenApproval?.localId ?? t('---')}
          />
        ),
      },
      {
        label: t('subject') + ':',
        value: (
          <FFListText
            color="secondary"
            text={t(event.tokenApproval?.subject ?? '') ?? t('---')}
          />
        ),
      },
    ],
  },
  [FF_EVENTS.TOKEN_APPROVAL_OP_FAILED]: {
    category: EventCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenApprovalOpFailed',
    enrichedEventKey: 'operation',
    eventKeyList: (event: IEvent): IDataListItem[] => [
      {
        label: t('operationErrorID') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.operation?.id ?? t('---')}
          />
        ),
      },
      {
        label: t('approvalID') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.operation?.correlator ?? t('---')}
          />
        ),
      },
      {
        label: t('operationError') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.operation?.error ?? t('---')}
          />
        ),
      },
    ],
  },
  [FF_EVENTS.TOKEN_TRANSFER_CONFIRMED]: {
    category: EventCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenTransferConfirmed',
    enrichedEventKey: 'tokenTransfer',
    eventKeyList: (event: IEvent): IDataListItem[] => {
      const list: IDataListItem[] = [
        {
          label: t('transferID') + ':',
          value: (
            <FFListText
              color="secondary"
              text={event.tokenTransfer?.localId ?? t('---')}
            />
          ),
        },
        {
          label: t('transferType') + ':',
          value: (
            <FFListText
              color="secondary"
              text={t(event.tokenTransfer?.type ?? '') ?? t('---')}
            />
          ),
        },
        {
          label: t('fromAddress') + ':',
          value: (
            <FFListText
              color="secondary"
              text={event.tokenTransfer?.from ?? t('nullAddress')}
            />
          ),
        },
        {
          label: t('toAddress') + ':',
          value: (
            <FFListText
              color="secondary"
              text={event.tokenTransfer?.to ?? t('nullAddress')}
            />
          ),
        },
        {
          label: t('amount') + ':',
          value: (
            <FFListText
              color="secondary"
              text={event.tokenTransfer?.amount ?? t('---')}
            />
          ),
        },
        {
          label: t('tokenIndex') + ':',
          value: (
            <FFListText
              color="secondary"
              text={event.tokenTransfer?.tokenIndex ?? t('---')}
            />
          ),
        },
      ];

      if (event.tokenTransfer?.tokenIndex) {
        list.push({
          label: t('tokenIndex') + ':',
          value: (
            <FFListText
              color="secondary"
              text={event.tokenTransfer?.tokenIndex ?? t('---')}
            />
          ),
        });
      }

      return list;
    },
  },
  [FF_EVENTS.TOKEN_TRANSFER_OP_FAILED]: {
    category: EventCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenTransferFailed',
    enrichedEventKey: 'operation',
    eventKeyList: (event: IEvent): IDataListItem[] => [
      {
        label: t('operationErrorID') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.operation?.id ?? t('---')}
          />
        ),
      },
      {
        label: t('transferID') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.operation?.correlator ?? t('---')}
          />
        ),
      },
      {
        label: t('operationError') + ':',
        value: (
          <FFListText
            color="secondary"
            text={event.operation?.error ?? t('---')}
          />
        ),
      },
    ],
  },
  // Default:
  // event.type, referenceID, correlatorID
};
