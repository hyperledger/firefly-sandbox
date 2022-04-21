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
import { ApplicationContext } from './contexts/ApplicationContext';
import { SnackbarContext } from './contexts/SnackbarContext';
import { IApiStatus, ISelfIdentity, IVerifier } from './interfaces/api';
import { themeOptions } from './theme';
import { fetchCatcher, summarizeFetchError } from './utils/fetches';

export const MAX_FORM_ROWS = 10;

function App() {
  const [initialized, setInitialized] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<SnackbarMessageType>('error');

  const [selfIdentity, setSelfIdentity] = useState<ISelfIdentity>();
  const [jsonPayload, setJsonPayload] = useState<object>({});
  const [payloadMissingFields, setPayloadMissingFields] =
    useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<IApiStatus>();
  const [apiResponse, setApiResponse] = useState<object>({
    type: '',
    id: '',
  });

  useEffect(() => {
    fetchCatcher(`${SDK_PATHS.organizations}/self`)
      .then((org: ISelfIdentity) => {
        fetchCatcher(SDK_PATHS.verifiers)
          .then((verifierRes: IVerifier[]) => {
            setSelfIdentity({
              ...org,
              ethereum_address: verifierRes.find(
                (verifier: IVerifier) => verifier.did === org.did
              )?.value,
            });
          })
          .catch((err) => {
            reportFetchError(err);
          });
      })
      .catch((err) => {
        reportFetchError(err);
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
