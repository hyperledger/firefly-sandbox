import { styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  Navigate,
  Outlet,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import { Header } from './components/Header';
import {
  TutorialSections,
  TUTORIAL_CATEGORIES,
  TUTORIAL_FORMS,
} from './constants/TutorialSections';
import { EventContext } from './contexts/EventContext';
import { FormContext } from './contexts/FormContext';
import { IEvent } from './interfaces/api';
import { IEventHistoryItem } from './interfaces/events';
import { ITutorial } from './interfaces/tutorialSection';

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

export const FORM_QUERY_KEY = 'form';
export const CATEGORY_QUERY_KEY = 'category';

export const AppWrapper: React.FC = () => {
  const { pathname, search } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [formID, setFormID] = useState<string | null>(null);
  const [formObject, setFormObject] = useState<ITutorial>();
  const [categoryID, setCategoryID] = useState<string | null>(null);
  const [logHistory, setLogHistory] = useState<Map<string, IEventHistoryItem>>(
    new Map()
  );
  const [justSubmitted, setJustSubmitted] = useState<boolean>(false);

  useEffect(() => {
    initializeFocusedForm();
  }, [pathname, search]);

  useEffect(() => {
    if (formID && formID.length && categoryID && categoryID.length) {
      const section = TutorialSections.find((ts) => ts.category === categoryID);
      if (section) {
        const action = section.tutorials.find((t) => t.formID === formID);
        action && setFormObject(action);
      }
    }
  }, [formID, categoryID]);

  const initializeFocusedForm = () => {
    const existingCategory = searchParams.get(CATEGORY_QUERY_KEY);
    setCategoryParam(existingCategory);
    const existingAction = searchParams.get(FORM_QUERY_KEY);
    setFormParam(existingAction);
  };

  const setCategoryParam = (categoryID: string | null) => {
    if (categoryID === null || categoryID === '') {
      searchParams.set(CATEGORY_QUERY_KEY, TUTORIAL_CATEGORIES.MESSAGES);
      setSearchParams(searchParams, { replace: true });
      setCategoryID(TUTORIAL_CATEGORIES.MESSAGES);
    } else {
      searchParams.set(CATEGORY_QUERY_KEY, categoryID);
      setSearchParams(searchParams, { replace: true });
      setCategoryID(categoryID);
    }
  };

  const setFormParam = (actionID: string | null) => {
    if (actionID === null || actionID === '') {
      searchParams.set(FORM_QUERY_KEY, TUTORIAL_FORMS.BROADCAST);
      setSearchParams(searchParams, { replace: true });
      setFormID(TUTORIAL_FORMS.BROADCAST);
    } else {
      searchParams.set(FORM_QUERY_KEY, actionID);
      setSearchParams(searchParams, { replace: true });
      setFormID(actionID);
    }
  };

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
          <FormContext.Provider
            value={{
              formID,
              setFormParam,
              formObject,
              categoryID,
              setCategoryParam,
              searchParams,
            }}
          >
            <Header></Header>
            <Outlet />
          </FormContext.Provider>
        </EventContext.Provider>
      </Main>
    </RootDiv>
  );
};
