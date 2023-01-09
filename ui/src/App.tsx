import {
  createTheme,
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { FF_Router } from './components/Router';
import {
  MessageSnackbar,
  SnackbarMessageType,
} from './components/Snackbar/MessageSnackbar';
import { SDK_PATHS } from './constants/SDK_PATHS';
import {
  GatewayTutorialSections,
  TutorialSections,
} from './constants/TutorialSections';
import { ApplicationContext } from './contexts/ApplicationContext';
import { SnackbarContext } from './contexts/SnackbarContext';
import {
  IApiStatus,
  IFireflyNamespace,
  ISelfIdentity,
  IVerifier,
} from './interfaces/api';
import { ITutorialSection } from './interfaces/tutorialSection';
import { themeOptions } from './theme';
import { fetchCatcher, summarizeFetchError } from './utils/fetches';

export const MAX_FORM_ROWS = 10;

function App() {
  const [initialized, setInitialized] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<SnackbarMessageType>('error');

  const [selfIdentity, setSelfIdentity] = useState<ISelfIdentity>();
  const [jsonPayload, setJsonPayload] = useState<object>({});
  const [payloadMissingFields, setPayloadMissingFields] =
    useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<IApiStatus>();
  const [multiparty, setMultiparty] = useState(true);
  const [apiResponse, setApiResponse] = useState<object>({
    type: '',
    id: '',
  });
  const [namespace, setNamespace] = useState('');
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [tokensDisabled, setTokensDisabled] = useState(false);
  const [blockchainPlugin, setBlockchainPlugin] = useState('');
  const [tutorialSections, setTutorialSections] = useState<ITutorialSection[]>(
    []
  );

  const changeNamespace = (ns: string) => {
    if (ns !== namespace) {
      // trigger refresh
      localStorage.setItem('sandboxNamespace', ns);
      window.location.reload();
    }
  };

  useEffect(() => {
    fetchCatcher(`${SDK_PATHS.namespaces}`)
      .then(async (namespacesResponse) => {
        const ffNamespaces = namespacesResponse as IFireflyNamespace[];
        let namespace: string;
        // load previous selected namespace from browser cache
        const savedSelectedNamespace = localStorage.getItem('sandboxNamespace');
        if (
          savedSelectedNamespace &&
          ffNamespaces.some((ns) => ns.name === savedSelectedNamespace)
        ) {
          namespace = savedSelectedNamespace;
        } else {
          // if previous selected namespace cannot be used, use the default / first one
          namespace =
            ffNamespaces.find((ns) => ns.default)?.name || ffNamespaces[0].name;

          localStorage.setItem('sandboxNamespace', namespace);
        }
        const isMultiParty = ffNamespaces.find(
          (ns) => ns.name === namespace
        )!.multiparty;
        setMultiparty(isMultiParty);
        setNamespaces(ffNamespaces.map((ns) => ns.name));
        setNamespace(namespace);

        if (isMultiParty) {
          setTutorialSections(TutorialSections);
          await fetchCatcher(`${SDK_PATHS.organizations}/self`).then(
            async (orgResponse) => {
              await fetchCatcher(SDK_PATHS.verifiers)
                .then((verifierRes: IVerifier[]) => {
                  setSelfIdentity({
                    ...orgResponse,
                    ethereum_address: verifierRes.find(
                      (verifier: IVerifier) => verifier.did === orgResponse.did
                    )?.value,
                  });
                })
                .catch((err) => {
                  reportFetchError(err);
                });
            }
          );
        } else {
          setTutorialSections(GatewayTutorialSections);
        }
        await fetchCatcher(`${SDK_PATHS.plugins}`).then(
          async (pluginsResponse) => {
            (!pluginsResponse.tokens || pluginsResponse.tokens.length === 0) &&
              setTokensDisabled(true);
            setBlockchainPlugin(
              pluginsResponse.blockchain.length > 0
                ? pluginsResponse.blockchain[0].pluginType
                : ''
            );
          }
        );
      })
      .finally(() => {
        setInitialized(true);
      });
  }, []);

  // Error snackbar
  const reportFetchError = (err: any) => {
    summarizeFetchError(err).then((message: string) => {
      setMessageType('error');
      setMessage(message);
    });
  };

  // Theme
  const theme = useMemo(() => {
    return createTheme(themeOptions);
  }, []);

  if (initialized) {
    return (
      <SnackbarContext.Provider
        value={{ setMessage, setMessageType, reportFetchError }}
      >
        <ApplicationContext.Provider
          value={{
            selfIdentity,
            jsonPayload,
            setJsonPayload,
            payloadMissingFields,
            setPayloadMissingFields,
            apiResponse,
            setApiResponse,
            apiStatus,
            setApiStatus,
            tokensDisabled,
            blockchainPlugin,
            multiparty,
            tutorialSections,
            namespace,
            namespaces,
            changeNamespace,
          }}
        >
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <CssBaseline>
                <FF_Router />
                <MessageSnackbar
                  {...{ message }}
                  {...{ setMessage }}
                  {...{ messageType }}
                />
              </CssBaseline>
            </ThemeProvider>
          </StyledEngineProvider>
        </ApplicationContext.Provider>
      </SnackbarContext.Provider>
    );
  } else {
    return <></>;
  }
}

export default App;
