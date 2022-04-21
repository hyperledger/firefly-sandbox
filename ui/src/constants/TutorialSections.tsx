import { Adjust, Description, Message } from '@mui/icons-material';
import { BroadcastForm } from '../components/Forms/Messages/BroadcastForm';
import { BurnForm } from '../components/Forms/Tokens/BurnForm';
import { ITutorialSection } from '../interfaces/tutorialSection';
import { DefineInterfaceForm } from '../components/Forms/Contracts/DefineInterfaceForm';
import { DeployContractForm } from '../components/Forms/Contracts/DeployContractForm';
import { RegisterContractApiForm } from '../components/Forms/Contracts/RegisterContractApiForm';
import { RegisterContractApiListenerForm } from '../components/Forms/Contracts/RegisterContractApiListenerForm';
import { DatatypeForm } from '../components/Forms/Messages/DatatypeForm';
import { SDK_PATHS } from './SDK_PATHS';
import { PrivateForm } from '../components/Forms/Messages/PrivateForm';
import { MintForm } from '../components/Forms/Tokens/MintForm';
import { PoolForm } from '../components/Forms/Tokens/PoolForm';
import { TransferForm } from '../components/Forms/Tokens/TransferForm';

export enum TUTORIAL_FORMS {
  // Messages
  BROADCAST = 'broadcast',
  PRIVATE = 'private',
  DATATYPE = 'datatypes',
  // Tokens
  POOL = 'pools',
  MINT = 'mint',
  TRANSFER = 'transfer',
  BURN = 'burn',
  // Contract
  DEPLOY_CONTRACT = 'deployContract',
  DEFINE_CONTRACT_INTERFACE = 'interface',
  REGISTER_CONTRACT_API = 'api',
  REGISTER_CONTRACT_API_LISTENER = 'listener',
}

export enum TUTORIAL_CATEGORIES {
  MESSAGES = 'messages',
  TOKENS = 'tokens',
  CONTRACTS = 'contracts',
}

export const TutorialSections: ITutorialSection[] = [
  {
    category: TUTORIAL_CATEGORIES.MESSAGES,
    icon: <Message />,
    tutorials: [
      {
        formID: TUTORIAL_FORMS.BROADCAST,
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/broadcast_data.html',
        endpoint: SDK_PATHS.messagesBroadcast,
        form: <BroadcastForm />,
        runnable: true,
        shortInfo: 'broadcastShortInfo',
        title: 'broadcastTitle',
      },
      {
        formID: TUTORIAL_FORMS.PRIVATE,
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/private_send.html',
        endpoint: SDK_PATHS.messagesPrivate,
        form: <PrivateForm />,
        runnable: true,
        shortInfo: 'privateShortInfo',
        title: 'privateTitle',
      },
      {
        formID: TUTORIAL_FORMS.DATATYPE,
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/define_datatype.html',
        endpoint: SDK_PATHS.messagesDatatypes,
        form: <DatatypeForm />,
        runnable: true,
        shortInfo: 'createDatatypeInfo',
        title: 'createDatatypeTitle',
      },
    ],
  },
  {
    category: TUTORIAL_CATEGORIES.TOKENS,
    icon: <Adjust />,
    tutorials: [
      {
        formID: TUTORIAL_FORMS.POOL,
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/mint_tokens.html#create-a-pool',
        endpoint: SDK_PATHS.tokensPools,
        form: <PoolForm />,
        runnable: true,
        shortInfo: 'poolShortInfo',
        title: 'poolTitle',
      },
      {
        formID: TUTORIAL_FORMS.MINT,
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/mint_tokens.html',
        endpoint: SDK_PATHS.tokensMint,
        form: <MintForm />,
        runnable: true,
        shortInfo: 'mintShortInfo',
        title: 'mintTitle',
      },
      {
        formID: TUTORIAL_FORMS.TRANSFER,
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/mint_tokens.html#transfer-tokens',
        endpoint: SDK_PATHS.tokensTransfer,
        form: <TransferForm />,
        runnable: true,
        shortInfo: 'transferShortInfo',
        title: 'transferTitle',
      },
      {
        formID: TUTORIAL_FORMS.BURN,
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/mint_tokens.html#burn-tokens',
        endpoint: SDK_PATHS.tokensBurn,
        form: <BurnForm />,
        runnable: true,
        shortInfo: 'burnShortInfo',
        title: 'burnTitle',
      },
    ],
  },
  {
    category: TUTORIAL_CATEGORIES.CONTRACTS,
    icon: <Description />,
    tutorials: [
      {
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/custom_contracts.html#contract-deployment',
        form: <DeployContractForm />,
        formID: TUTORIAL_FORMS.DEPLOY_CONTRACT,
        shortInfo: 'deployContractInfo',
        title: 'deployContractTitle',
        runnable: false,
      },
      {
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/custom_contracts.html#broadcast-the-contract-interface',
        endpoint: SDK_PATHS.contractsInterface,
        form: <DefineInterfaceForm />,
        formID: TUTORIAL_FORMS.DEFINE_CONTRACT_INTERFACE,
        shortInfo: 'defineContractInterfaceInfo',
        runnable: true,
        title: 'contractInterfaceTitle',
      },
      {
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/custom_contracts.html#create-an-http-api-for-the-contract',
        endpoint: SDK_PATHS.contractsApi,
        form: <RegisterContractApiForm />,
        formID: TUTORIAL_FORMS.REGISTER_CONTRACT_API,
        shortInfo: 'registerContractApiInfo',
        runnable: true,
        title: 'registerContractApiTitle',
      },
      {
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/custom_contracts.html#create-a-blockchain-event-listener',
        endpoint: SDK_PATHS.contractsListener,
        form: <RegisterContractApiListenerForm />,
        formID: TUTORIAL_FORMS.REGISTER_CONTRACT_API_LISTENER,
        shortInfo: 'registerContractApiListenerInfo',
        runnable: true,
        title: 'registerApiListenerTitle',
      },
    ],
  },
];
