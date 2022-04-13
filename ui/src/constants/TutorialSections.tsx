import { BroadcastForm } from '../components/Forms/BroadcastForm';
import { BurnForm } from '../components/Forms/BurnForm';
import { MintForm } from '../components/Forms/MintForm';
import { PoolForm } from '../components/Forms/PoolForm';
import { PrivateForm } from '../components/Forms/PrivateForm';
import { TransferForm } from '../components/Forms/TransferForm';
import { ITutorialSection } from '../interfaces/tutorialSection';
import { FF_Paths } from './FF_Paths';
import { DefineInterfaceForm } from '../components/Forms/Contracts/DefineInterfaceForm';
import { DeployContractForm } from '../components/Forms/Contracts/DeployContractForm';
import { RegisterContractApiForm } from '../components/Forms/Contracts/RegisterContractApiForm';
import { RegisterContractApiListenerForm } from '../components/Forms/Contracts/RegisterContractApiListenerForm';

export enum TUTORIALS {
  BROADCAST = 'broadcast',
  PRIVATE = 'private',
  POOL = 'pools',
  MINT = 'mint',
  TRANSFER = 'transfer',
  BURN = 'burn',
  DEFINE_CONTRACT_INTERFACE = 'interface',
  REGISTER_CONTRACT_API = 'api',
  REGISTER_CONTRACT_API_LISTENER = 'listener',
}

export enum TUTORIAL_CATEGORIES {
  MESSAGING = 'messaging',
  TOKENS = 'tokens',
  CONTRACTS = 'contracts',
}

export const TutorialSections: ITutorialSection[] = [
  {
    title: TUTORIAL_CATEGORIES.MESSAGING,
    tutorials: [
      {
        id: TUTORIALS.BROADCAST,
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/broadcast_data.html',
        endpoint: FF_Paths.broadcast,
        form: <BroadcastForm />,
        shortInfo: 'broadcastShortInfo',
        title: 'broadcastTitle',
      },
      {
        id: TUTORIALS.PRIVATE,
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/private_send.html',
        endpoint: FF_Paths.private,
        form: <PrivateForm />,
        shortInfo: 'privateShortInfo',
        title: 'privateTitle',
      },
    ],
  },
  {
    title: TUTORIAL_CATEGORIES.TOKENS,
    tutorials: [
      {
        id: TUTORIALS.POOL,
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/mint_tokens.html#create-a-pool',
        endpoint: FF_Paths.pools,
        form: <PoolForm />,
        shortInfo: 'poolShortInfo',
        title: 'poolTitle',
      },
      {
        id: TUTORIALS.MINT,
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/mint_tokens.html',
        endpoint: FF_Paths.mint,
        form: <MintForm />,
        shortInfo: 'mintShortInfo',
        title: 'mintTitle',
      },
      {
        id: TUTORIALS.TRANSFER,
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/mint_tokens.html#transfer-tokens',
        endpoint: FF_Paths.transfer,
        form: <TransferForm />,
        shortInfo: 'transferShortInfo',
        title: 'transferTitle',
      },
      {
        id: TUTORIALS.BURN,
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/mint_tokens.html#burn-tokens',
        endpoint: FF_Paths.burn,
        form: <BurnForm />,
        shortInfo: 'burnShortInfo',
        title: 'burnTitle',
      },
    ],
  },
  {
    title: TUTORIAL_CATEGORIES.CONTRACTS,
    tutorials: [
      {
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/custom_contracts.html#contract-deployment',
        endpoint: FF_Paths.interface,
        form: <DeployContractForm />,
        id: 'deploycontract',
        shortInfo: 'deployContractInfo',
        title: 'deployContractTitle',
      },
      {
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/custom_contracts.html#broadcast-the-contract-interface',
        endpoint: FF_Paths.interface,
        form: <DefineInterfaceForm />,
        id: TUTORIALS.DEFINE_CONTRACT_INTERFACE,
        shortInfo: 'defineContractInterfaceInfo',
        title: 'contractInterfaceTitle',
      },
      {
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/custom_contracts.html#create-an-http-api-for-the-contract',
        endpoint: FF_Paths.api,
        form: <RegisterContractApiForm />,
        id: TUTORIALS.REGISTER_CONTRACT_API,
        shortInfo: 'registerContractApiInfo',
        title: 'registerContractApiTitle',
      },
      {
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/custom_contracts.html#create-a-blockchain-event-listener',
        endpoint: FF_Paths.listener,
        form: <RegisterContractApiListenerForm />,
        id: TUTORIALS.REGISTER_CONTRACT_API_LISTENER,
        shortInfo: 'registerContractApiListenerInfo',
        title: 'registerApiListenerTitle',
      },
    ],
  },
];
