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
  const [jsonPayload, setJsonPayload] = useState<object>({});
  const [activeForm, setActiveForm] = useState<string>('broadcast');
  // useEffect(() => {
  //   Promise.all([
  //     fetchWithCredentials(FF_Paths.nsPrefix),
  //     fetchWithCredentials(`${FF_Paths.apiPrefix}${FF_Paths.status}`),
  //     fetchWithCredentials(
  //       `${FF_Paths.apiPrefix}${FF_Paths.networkIdentities}`
  //     ),
  //     fetchWithCredentials(
  //       `${FF_Paths.nsPrefix}/${SELECTED_NAMESPACE}${FF_Paths.tokenConnectors}`
  //     ),
  //   ])
  //     .then(
  //       async ([
  //         namespaceResponse,
  //         statusResponse,
  //         identitiesResponse,
  //         connectorsResponse,
  //       ]) => {
  //         if (
  //           namespaceResponse.ok &&
  //           statusResponse.ok &&
  //           identitiesResponse.ok &&
  //           connectorsResponse.ok
  //         ) {
  //           const status: IStatus = await statusResponse.json();
  //           const nodeDID = status.org.did;
  //           setIdentity(nodeDID);
  //           setOrgID(status.org.id);
  //           setOrgName(status.org.name);
  //           setNodeID(status.node.id);
  //           setNodeName(status.node.name);
  //           setSelectedNamespace(status.defaults.namespace);
  //           const ns: INamespace[] = await namespaceResponse.json();
  //           setNamespaces(ns);
  //           const identities: INetworkIdentity[] =
  //             await identitiesResponse.json();
  //           setIdentities(identities.filter((id) => id.did !== nodeDID));
  //           const connectors: ITokenConnector[] =
  //             await connectorsResponse.json();
  //           setConnectors(connectors);
  //         }
  //       }
  //     )
  //     .catch((e) => {
  //       setInitError(e);
  //     })
  //     .finally(() => {
  //       setInitialized(true);
  //     });
  // }, []);

  // useEffect(() => {
  //   if (selectedNamespace) {
  //     ws.current = new ReconnectingWebSocket(
  //       process.env.NODE_ENV === 'development'
  //         ? `ws://localhost:5000/ws?namespace=${selectedNamespace}&ephemeral&autoack`
  //         : `${protocol}://${window.location.hostname}:${window.location.port}/ws?namespace=${selectedNamespace}&ephemeral&autoack`
  //     );
  //     ws.current.onmessage = (event: any) => {
  //       const eventData = JSON.parse(event.data);
  //       const eventType: FF_EVENTS = eventData.type;
  //       if (Object.values(FF_EVENTS).includes(eventType)) {
  //         setNewEvents((existing) => [eventType, ...existing]);
  //       }
  //     };
  //     ws.current.onopen = () => {
  //       setIsWsConnected(true);
  //     };
  //     ws.current.onclose = () => {
  //       setIsWsConnected(false);
  //     };

  //     return () => {
  //       if (ws.current) {
  //         ws.current.close();
  //       }
  //     };
  //   }
  // }, [selectedNamespace]);

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
              value={{ jsonPayload, setJsonPayload, activeForm, setActiveForm }}
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
