import { styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { EventContext } from './contexts/EventContext';
import { IEvent } from './interfaces/api';
import { IEventHistoryItem } from './interfaces/events';

const Main = styled('main')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  overflow: 'auto',
});

const RootDiv = styled('div')({
  display: 'flex',
});

let dumbAwaitedEventID: string | undefined = undefined;
export const setDumbAwaitedEventId = (eventId: string | undefined) => {
  dumbAwaitedEventID = eventId;
};
export const AppWrapper: React.FC = () => {
  const { pathname } = useLocation();
  const [logHistory, setLogHistory] = useState<Map<string, IEventHistoryItem>>(
    new Map()
  );
  const [justSubmitted, setJustSubmitted] = useState<boolean>(false);

  useEffect(() => {
    setJustSubmitted(false);
  }, [dumbAwaitedEventID]);

  const isFinalEvent = (t: string) => {
    return (
      t.endsWith('confirmed') || t.endsWith('rejected') || t.endsWith('failed')
    );
  };

  const isFailed = (t: string) => {
    return t.endsWith('rejected') || t.endsWith('failed');
  };

  const addLogToHistory = (event: IEvent) => {
    setLogHistory((logHistory) => {
      // This is bad practice, and should be optimized in the future
      const deepCopyMap: Map<string, IEventHistoryItem> = new Map(
        JSON.parse(JSON.stringify(Array.from(logHistory)))
      );
      const txMap = deepCopyMap.get(event.tx);

      if (txMap !== undefined) {
        // TODO: Need better logic
        const isComplete = !!(
          event.reference === dumbAwaitedEventID || event.correlator
        );
        if (isComplete || isFailed(event.type)) {
          dumbAwaitedEventID = undefined;
          setJustSubmitted(false);
        }
        return new Map(
          deepCopyMap.set(event.tx, {
            events: [event, ...txMap.events],
            created: event.created,
            isComplete: isFinalEvent(event.type),
            isFailed: isFailed(event.type),
          })
        );
      } else {
        return new Map(
          deepCopyMap.set(event.tx, {
            events: [event],
            created: event.created,
            isComplete: isFinalEvent(event.type),
            isFailed: isFailed(event.type),
          })
        );
      }
    });
  };

  const addAwaitedEventID = (apiRes: any) => {
    if (apiRes?.id && apiRes?.id) {
      dumbAwaitedEventID = apiRes.id;
    }
  };

  if (pathname === '/') {
    return <Navigate to="/home" replace={true} />;
  }

  return (
    <RootDiv>
      <Main>
        <EventContext.Provider
          value={{
            logHistory,
            addLogToHistory,
            addAwaitedEventID,
            justSubmitted,
            setJustSubmitted,
            dumbAwaitedEventID,
          }}
        >
          <Header></Header>
          <Outlet />
        </EventContext.Provider>
      </Main>
    </RootDiv>
  );
};
