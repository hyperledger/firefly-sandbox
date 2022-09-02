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
  IFireflyStatus,
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
  const [tokensDisabled, setTokensDisabled] = useState(false);
  const [blockchainPlugin, setBlockchainPlugin] = useState('');
  const [tutorialSections, setTutorialSections] = useState<ITutorialSection[]>(
    []
  );

  useEffect(() => {
    Promise.all([
      fetchCatcher(`${SDK_PATHS.status}`),
      fetchCatcher(`${SDK_PATHS.organizations}/self`),
      fetchCatcher(`${SDK_PATHS.plugins}`),
    ])
      .then(async ([statusResponse, orgResponse, pluginsResponse]) => {
        (!pluginsResponse.tokens || pluginsResponse.tokens.length === 0) &&
          setTokensDisabled(true);
        setBlockchainPlugin(
          pluginsResponse.blockchain.length > 0
            ? pluginsResponse.blockchain[0].pluginType
            : ''
        );
        const ffStatus = statusResponse as IFireflyStatus;
        setMultiparty(ffStatus.multiparty);
        setNamespace(ffStatus.namespace);
        if (ffStatus.multiparty === true) {
          setTutorialSections(TutorialSections);
          fetchCatcher(SDK_PATHS.verifiers)
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
        } else {
          setTutorialSections(GatewayTutorialSections);
        }
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
