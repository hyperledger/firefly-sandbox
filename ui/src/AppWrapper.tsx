import { styled } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
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
import { ApplicationContext } from './contexts/ApplicationContext';
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

export const ACTION_QUERY_KEY = 'action';
export const ACTION_DELIM = '.';
export const DEFAULT_ACTION = [
  TUTORIAL_CATEGORIES.MESSAGES,
  TUTORIAL_FORMS.BROADCAST,
];

export const AppWrapper: React.FC = () => {
  const { pathname, search } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setPayloadMissingFields } = useContext(ApplicationContext);
  const [action, setAction] = useState<string | null>(null);
  const [categoryID, setCategoryID] = useState<string | undefined>(undefined);
  const [formID, setFormID] = useState<string | undefined>(undefined);

  const [formObject, setFormObject] = useState<ITutorial>();
  const [logHistory, setLogHistory] = useState<Map<string, IEventHistoryItem>>(
    new Map()
  );
  const [justSubmitted, setJustSubmitted] = useState<boolean>(false);

  useEffect(() => {
    initializeFocusedForm();
  }, [pathname, search]);

  // Set form object based on action
  useEffect(() => {
    if (action && isValidAction(action)) {
      const section = TutorialSections.find(
        (ts) => ts.category === getValidAction(action)[0]
      );
      if (section) {
        const tutorial = section.tutorials.find(
          (t) => t.formID === getValidAction(action)[1]
        );
        setFormObject(tutorial);
      }
    }
  }, [action]);

  const initializeFocusedForm = () => {
    const existingAction = searchParams.get(ACTION_QUERY_KEY);

    if (existingAction === null) {
      setCategoryID(DEFAULT_ACTION[0]);
      setFormID(DEFAULT_ACTION[1]);
      setActionParam(DEFAULT_ACTION[0], DEFAULT_ACTION[1]);
    } else {
      const validAction: string[] = getValidAction(existingAction);
      setCategoryID(validAction[0]);
      setFormID(validAction[1]);
      setActionParam(validAction[0], validAction[1]);
    }
  };

  const setActionParam = (categoryID: string, formID: string) => {
    const newAction = `${categoryID}.${formID}`;
    searchParams.set(ACTION_QUERY_KEY, newAction);
    setSearchParams(searchParams, { replace: true });
    setAction(newAction);
    setPayloadMissingFields(false);
  };

  const isValidAction = (action: string) => {
    const validAction = action.split(ACTION_DELIM);

    // If valid action is not delimited correctly
    if (validAction.length !== 2) {
      return false;
    }
    // If category ID is invalid
    const categoryID = validAction[0];
    if (
      !Object.values(TUTORIAL_CATEGORIES).includes(
        categoryID as TUTORIAL_CATEGORIES
      )
    ) {
      return false;
    }
    // If formID is invalid
    const category = TutorialSections.find((ts) => ts.category === categoryID);
    if (!category?.tutorials.find((t) => t.formID === validAction[1])) {
      return false;
    }

    return true;
  };

  const getValidAction = (action: string) => {
    if (!isValidAction(action)) {
      return DEFAULT_ACTION;
    }

    return action.split(ACTION_DELIM);
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
              action,
              setActionParam,
              categoryID,
              formID,
              formObject,
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
