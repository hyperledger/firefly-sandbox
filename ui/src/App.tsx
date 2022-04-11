import {
  createTheme,
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { FF_Router } from './components/Router';
import {
  MessageSnackbar,
  SnackbarMessageType,
} from './components/Snackbar/MessageSnackbar';
import { FF_Paths } from './constants/FF_Paths';
import { ApplicationContext } from './contexts/ApplicationContext';
import { JsonPayloadContext } from './contexts/JsonPayloadContext';
import { SnackbarContext } from './contexts/SnackbarContext';
import { FF_EVENTS } from './ff_models/eventTypes';
import {
  INamespace,
  INetworkIdentity,
  ISelfIdentity,
  IStatus,
  ITokenConnector,
} from './interfaces/api';
import { themeOptions } from './theme';
import { fetchWithCredentials, summarizeFetchError } from './utils/fetches';

export const SELECTED_NAMESPACE = 'default';

function App() {
  const [initialized, setInitialized] = useState(true);
  const [initError, setInitError] = useState<string | undefined>();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<SnackbarMessageType>('error');
  const [namespaces, setNamespaces] = useState<INamespace[]>([]);
  const [selectedNamespace, setSelectedNamespace] = useState('');
  const [connectors, setConnectors] = useState<ITokenConnector[]>([]);
  const [identity, setIdentity] = useState('');
  const [identities, setIdentities] = useState<INetworkIdentity[]>([]);
  const [orgID, setOrgID] = useState('');
  const [orgName, setOrgName] = useState('');
  const [nodeID, setNodeID] = useState('');
  const [nodeName, setNodeName] = useState('');
  const [isWsConnected, setIsWsConnected] = useState(false);
  const ws = useRef<ReconnectingWebSocket | null>(null);
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const [newEvents, setNewEvents] = useState<FF_EVENTS[]>([]);
  const [lastRefreshTime, setLastRefresh] = useState<string>(
    new Date().toISOString()
  );

  const [selfIdentity, setSelfIdentity] = useState<ISelfIdentity>();
  const [jsonPayload, setJsonPayload] = useState<object>({});
  const [activeForm, setActiveForm] = useState<string>('broadcast');
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

  // Event handling for websockets
  const clearNewEvents = () => {
    setNewEvents([]);
    setLastRefresh(new Date().toISOString());
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
        <ApplicationContext.Provider
          value={{
            namespaces,
            selectedNamespace,
            setSelectedNamespace,
            orgID,
            orgName,
            nodeID,
            nodeName,
            identity,
            identities,
            connectors,
            isWsConnected,
            newEvents,
            clearNewEvents,
            lastRefreshTime,
          }}
        >
          <SnackbarContext.Provider
            value={{ setMessage, setMessageType, reportFetchError }}
          >
            <JsonPayloadContext.Provider
              value={{
                selfIdentity,
                jsonPayload,
                setJsonPayload,
                activeForm,
                setActiveForm,
                apiResponse,
                setApiResponse,
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
            </JsonPayloadContext.Provider>
          </SnackbarContext.Provider>
        </ApplicationContext.Provider>
      );
    }
  } else {
    return <></>;
  }
}

export default App;
