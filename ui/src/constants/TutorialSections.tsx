import { BroadcastForm } from '../components/Forms/BroadcastForm';
import { BurnForm } from '../components/Forms/BurnForm';
import { MintForm } from '../components/Forms/MintForm';
import { PoolForm } from '../components/Forms/PoolForm';
import { PrivateForm } from '../components/Forms/PrivateForm';
import { TransferForm } from '../components/Forms/TransferForm';
import { ITutorialSection } from '../interfaces/tutorialSection';
import { FF_Paths } from './FF_Paths';

export const TutorialSections: ITutorialSection[] = [
  {
    title: 'Messaging',
    tutorials: [
      {
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/broadcast_data.html',
        endpoint: FF_Paths.broadcast,
        form: <BroadcastForm />,
        link: 'broadcast',
        shortInfo: 'broadcastShortInfo',
        title: 'broadcastTitle',
      },
      {
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/private_send.html',
        endpoint: FF_Paths.private,
        form: <PrivateForm />,
        link: 'private',
        shortInfo: 'privateShortInfo',
        title: 'privateTitle',
      },
    ],
  },
  {
    title: 'Tokens',
    tutorials: [
      {
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/mint_tokens.html#create-a-pool',
        endpoint: FF_Paths.pools,
        form: <PoolForm />,
        link: 'pools',
        shortInfo: 'poolShortInfo',
        title: 'poolTitle',
      },
      {
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/mint_tokens.html',
        endpoint: FF_Paths.mint,
        form: <MintForm />,
        link: 'mint',
        shortInfo: 'mintShortInfo',
        title: 'mintTitle',
      },
      {
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/mint_tokens.html#transfer-tokens',
        endpoint: FF_Paths.transfer,
        form: <TransferForm />,
        link: 'transfer',
        shortInfo: 'transferShortInfo',
        title: 'transferTitle',
      },
      {
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/mint_tokens.html#burn-tokens',
        endpoint: FF_Paths.burn,
        form: <BurnForm />,
        link: 'burn',
        shortInfo: 'burnShortInfo',
        title: 'burnTitle',
      },
    ],
  },
  {
    title: 'Contracts',
    tutorials: [
      // {
      //   docsURL:
      //     'https://hyperledger.github.io/firefly/gettingstarted/custom_contracts.html#contract-deployment',
      //   endpoint: FF_Paths.contractInterfaces,
      //   form: <TransferForm />,
      //   link: 'deploycontract',
      //   shortInfo: 'deployContractInfo',
      //   title: 'deployContractTitle',
      // },
      {
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/custom_contracts.html#broadcast-the-contract-interface',
        endpoint: FF_Paths.contractInterfaces,
        form: <PoolForm />,
        link: 'definecontractinterface',
        shortInfo: 'defineContractInterfaceInfo',
        title: 'contractInterfaceTitle',
      },
      {
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/custom_contracts.html#create-an-http-api-for-the-contract',
        endpoint: FF_Paths.contractApis,
        form: <MintForm />,
        link: 'registercontractapi',
        shortInfo: 'registerContractApiInfo',
        title: 'registerContractApiTitle',
      },
      // {
      //   docsURL:
      //     'https://hyperledger.github.io/firefly/gettingstarted/mint_tokens.html#burn-tokens',
      //   endpoint: FF_Paths.burn,
      //   form: <BurnForm />,
      //   link: 'registercontractapilistener',
      //   shortInfo: 'registerContractApiListenerInfo',
      //   title: 'registerApiListenerTitle',
      // },
    ],
  },
];
