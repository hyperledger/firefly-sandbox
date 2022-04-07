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
        endpoint: FF_Paths.messagesBroadcast,
        form: <BroadcastForm />,
        link: 'broadcast',
        shortInfo: 'broadcastShortInfo',
        title: 'broadcastTitle',
      },
      {
        docsURL:
          'https://hyperledger.github.io/firefly/gettingstarted/private_send.html',
        endpoint: FF_Paths.messagesPrivate,
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
        endpoint: FF_Paths.tokenPools,
        form: <PoolForm />,
        link: 'tokenpools',
        shortInfo: 'poolShortInfo',
        title: 'poolTitle',
      },
      // {
      //   docsURL:
      //     'https://hyperledger.github.io/firefly/gettingstarted/mint_tokens.html',
      //   endpoint: FF_Paths.tokenMint,
      //   form: <MintForm />,
      //   link: 'mint',
      //   shortInfo: 'mintShortInfo',
      //   title: 'mintTitle',
      // },
      // {
      //   docsURL:
      //     'https://hyperledger.github.io/firefly/gettingstarted/mint_tokens.html#transfer-tokens',
      //   endpoint: FF_Paths.tokenTransfers,
      //   form: <TransferForm />,
      //   link: 'transfer',
      //   shortInfo: 'transferShortInfo',
      //   title: 'transferTitle',
      // },
      // {
      //   docsURL:
      //     'https://hyperledger.github.io/firefly/gettingstarted/mint_tokens.html#burn-tokens',
      //   endpoint: FF_Paths.tokenBurn,
      //   form: <BurnForm />,
      //   link: 'burn',
      //   shortInfo: 'burnShortInfo',
      //   title: 'burnTitle',
      // },
    ],
  },
];
