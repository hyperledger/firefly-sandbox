import {
  createTheme,
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FF_Router } from './components/Router';
import {
  MessageSnackbar,
  SnackbarMessageType,
} from './components/Snackbar/MessageSnackbar';
import { IApiStatus, ApplicationContext } from './contexts/ApplicationContext';
import { SnackbarContext } from './contexts/SnackbarContext';
import { ISelfIdentity } from './interfaces/api';
import { themeOptions } from './theme';
import { fetchWithCredentials, summarizeFetchError } from './utils/fetches';

export const SELECTED_NAMESPACE = 'default';

function App() {
  const [initialized, setInitialized] = useState(true);
  const [initError, setInitError] = useState<string | undefined>();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<SnackbarMessageType>('error');

  const [selfIdentity, setSelfIdentity] = useState<ISelfIdentity>();
  const [jsonPayload, setJsonPayload] = useState<object>({});
  const [activeForm, setActiveForm] = useState<string>('broadcast');
  const [apiStatus, setApiStatus] = useState<IApiStatus>();
  const [apiResponse, setApiResponse] = useState<object>({});
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/common/organizations/self`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((org) => {
        fetch(`/api/common/verifiers`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            setSelfIdentity({
              ...org,
              ethereum_address: data.find((d: any) => d.did === org.did).value,
            });
          })
          .catch(() => {
            return null;
          });
      })
      .catch(() => {
        return null;
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
    if (initError) {
      // TODO: figure out what to display
      return (
        <>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <CssBaseline>Fallback</CssBaseline>
            </ThemeProvider>
          </StyledEngineProvider>
        </>
      );
    } else {
      return (
        <SnackbarContext.Provider
          value={{ setMessage, setMessageType, reportFetchError }}
        >
          <ApplicationContext.Provider
            value={{
              selfIdentity,
              jsonPayload,
              setJsonPayload,
              activeForm,
              setActiveForm,
              apiResponse,
              setApiResponse,
              apiStatus,
              setApiStatus,
              logs,
              setLogs,
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
    }
  } else {
    return <></>;
  }
}

export default App;
