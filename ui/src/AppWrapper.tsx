import { styled } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  useLocation,
  useNavigate,
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
import { FF_EVENTS, FINISHED_EVENT_SUFFIX } from './ff_models/eventTypes';
import { FF_TX_CATEGORY_MAP } from './ff_models/transactionTypes';
import { IEvent, ITokenPool } from './interfaces/api';
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

export const ACTION_QUERY_KEY = 'action';
export const ACTION_DELIM = '.';
export const DEFAULT_ACTION = [
  TUTORIAL_CATEGORIES.MESSAGES,
  TUTORIAL_FORMS.BROADCAST,
];

export const DEFAULT_GATEWAY_ACTION = [
  TUTORIAL_CATEGORIES.TOKENS,
  TUTORIAL_FORMS.POOL,
];

export const AppWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const { setPayloadMissingFields, multiparty, tutorialSections } =
    useContext(ApplicationContext);
  const [action, setAction] = useState<string | null>(null);
  const [categoryID, setCategoryID] = useState<string | undefined>(undefined);
  const [formID, setFormID] = useState<string | undefined>(undefined);
  const [isBlob, setIsBlob] = useState<boolean>(false);
  const [formObject, setFormObject] = useState<ITutorial>();
  const [logHistory, setLogHistory] = useState<Map<string, IEventHistoryItem>>(
    new Map(),
  );
  const [awaitedEventID, setAwaitedEventID] = useState<string | undefined>(
    undefined,
  );
  const [poolObject, setPoolObject] = useState<ITokenPool | undefined>(
    undefined,
  );
  const [refreshBalances, setRefreshBalances] = useState(new Date().toString());
  const [refreshAPIs, setRefreshAPIs] = useState(new Date().toString());

  useEffect(() => {
    initializeFocusedForm();
  }, [pathname, search, tutorialSections]);

  // Set form object based on action
  useEffect(() => {
    if (action && isValidAction(action)) {
      const section = TutorialSections.find(
        (ts) => ts.category === getValidAction(action)[0],
      );
      if (section) {
        const tutorial = section.tutorials.find(
          (t) => t.formID === getValidAction(action)[1],
        );
        setFormObject(tutorial);
        setPayloadMissingFields(false);
      }
    }
  }, [action]);

  const initializeFocusedForm = () => {
    const existingAction = searchParams.get(ACTION_QUERY_KEY);
    if (existingAction === null) {
      if (multiparty) {
        setCategoryID(DEFAULT_ACTION[0]);
        setFormID(DEFAULT_ACTION[1]);
        setActionParam(DEFAULT_ACTION[0], DEFAULT_ACTION[1]);
      } else {
        setCategoryID(DEFAULT_GATEWAY_ACTION[0]);
        setFormID(DEFAULT_GATEWAY_ACTION[1]);
        setActionParam(DEFAULT_GATEWAY_ACTION[0], DEFAULT_GATEWAY_ACTION[1]);
      }
    } else {
      const validAction: string[] = getValidAction(existingAction);
      setCategoryID(validAction[0]);
      setFormID(validAction[1]);
      setActionParam(validAction[0], validAction[1]);
    }
    setIsBlob(false);
  };

  const setActionParam = (categoryID: string, formID: string) => {
    const oldAction = action;
    const newAction = `${categoryID}.${formID}`;
    searchParams.set(ACTION_QUERY_KEY, newAction);
    setSearchParams(searchParams, { replace: true });
    setAction(newAction);
    oldAction !== newAction && setPayloadMissingFields(false);
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
        categoryID as TUTORIAL_CATEGORIES,
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
      if (multiparty) {
        return DEFAULT_ACTION;
      } else {
        return DEFAULT_GATEWAY_ACTION;
      }
    }

    return action.split(ACTION_DELIM);
  };

  const isFinalEvent = (event: IEvent) => {
    if (
      event.type.endsWith(FINISHED_EVENT_SUFFIX.CONFIRMED) ||
      event.type.endsWith(FINISHED_EVENT_SUFFIX.SUCCEEDED) ||
      event.type.endsWith(FINISHED_EVENT_SUFFIX.REJECTED) ||
      event.type.endsWith(FINISHED_EVENT_SUFFIX.FAILED)
    )
      return true;

    if (event.reference === awaitedEventID || event.correlator) return true;

    return false;
  };

  const isFailed = (t: string) => {
    return (
      t.endsWith(FINISHED_EVENT_SUFFIX.REJECTED) ||
      t.endsWith(FINISHED_EVENT_SUFFIX.FAILED)
    );
  };

  const addLogToHistory = (event: IEvent) => {
    // Update balance and API boxes, if those events are confirmed
    if (event.type === FF_EVENTS.TOKEN_TRANSFER_CONFIRMED)
      setRefreshBalances(new Date().toString());
    if (event.type === FF_EVENTS.CONTRACT_API_CONFIRMED)
      setRefreshAPIs(new Date().toString());

    setLogHistory((logHistory) => {
      // Must deep copy map since it has nested json data
      const deepCopyMap: Map<string, IEventHistoryItem> = new Map(
        JSON.parse(JSON.stringify(Array.from(logHistory))),
      );
      const txMap = deepCopyMap.get(event.tx);

      // If transaction is already in map, append the event
      if (txMap !== undefined) {
        if (isFailed(event.type) || isFinalEvent(event)) {
          setAwaitedEventID(undefined);
        }
        return new Map(
          deepCopyMap.set(event.tx, {
            events: [event, ...txMap.events],
            created: event.created,
            isComplete: isFinalEvent(event),
            isFailed: isFailed(event.type),
            showIcons: txMap.showIcons,
            showTxHash: txMap.showTxHash,
            txName: txMap.txName,
          }),
        );
      }

      const newEvent: IEventHistoryItem = {
        events: [event],
        created: event.created,
        isComplete: isFinalEvent(event),
        isFailed: isFailed(event.type),
        showIcons: true,
        showTxHash: true,
        txName: event.transaction?.type
          ? t(FF_TX_CATEGORY_MAP[event.transaction.type].nicename)
          : t('none'),
      };

      // If transactionID is unknown
      if (event.tx === undefined) {
        return new Map(
          deepCopyMap.set(event.id, {
            ...newEvent,
            showIcons: false,
            showTxHash: false,
            txName: t('none'),
          }),
        );
      }

      return new Map(
        deepCopyMap.set(event.tx, {
          ...newEvent,
          showIcons: event.pool ? event.pool.dataSupport : true,
        }),
      );
    });
  };

  const addAwaitedEventID = (apiRes: any) => {
    if (apiRes?.id && apiRes?.id) {
      setAwaitedEventID(apiRes.id);
    }
  };

  useEffect(() => {
    if (pathname === '/') {
      navigate('/home', { replace: true });
    }
  }, [pathname]);

  return (
    <RootDiv>
      <Main>
        <EventContext.Provider
          value={{
            logHistory,
            addLogToHistory,
            addAwaitedEventID,
            awaitedEventID,
            refreshBalances,
            refreshAPIs,
          }}
        >
          <FormContext.Provider
            value={{
              action,
              setActionParam,
              categoryID,
              formID,
              formObject,
              isBlob,
              setIsBlob,
              searchParams,
              poolObject,
              setPoolObject,
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
