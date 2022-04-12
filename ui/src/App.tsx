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
import { ApplicationContext } from './contexts/ApplicationContext';
import { EventContext } from './contexts/EventContext';
import { SnackbarContext } from './contexts/SnackbarContext';
import { IApiStatus, ISelfIdentity } from './interfaces/api';
import { IEventHistoryItem } from './interfaces/events';
import { themeOptions } from './theme';
import { summarizeFetchError } from './utils/fetches';

function App() {
  const [initialized, setInitialized] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<SnackbarMessageType>('error');

  const [selfIdentity, setSelfIdentity] = useState<ISelfIdentity>();
  const [jsonPayload, setJsonPayload] = useState<object>({});
  const [activeForm, setActiveForm] = useState<string>('broadcast');
  const [apiStatus, setApiStatus] = useState<IApiStatus>();
  const [apiResponse, setApiResponse] = useState<object>({
    type: '',
    id: '',
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [logHistory, setLogHistory] = useState<Map<string, IEventHistoryItem>>(
    new Map()
  );

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

  const addLogToHistory = (event: any) => {
    setLogHistory((logHistory) => {
      // This is bad practice, and should be optimized in the future
      const deepCopyMap: Map<string, IEventHistoryItem> = new Map(
        JSON.parse(JSON.stringify(Array.from(logHistory)))
      );

      const txMap = deepCopyMap.get(event.tx);
      if (txMap !== undefined) {
        return new Map(
          deepCopyMap.set(event.tx, {
            events: [...txMap.events, event],
            created: event.created,
          })
        );
      } else {
        return new Map(
          deepCopyMap.set(event.tx, {
            events: [event],
            created: event.created,
          })
        );
      }
    });
  };

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
          <EventContext.Provider
            value={{
              logHistory,
              addLogToHistory,
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
          </EventContext.Provider>
        </ApplicationContext.Provider>
      </SnackbarContext.Provider>
    );
  } else {
    return <></>;
  }
}

export default App;
