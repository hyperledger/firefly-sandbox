import { IEvent } from './api';

export interface IEventHistory {
  [key: string]: IEventHistoryItem;
}

export interface IEventHistoryItem {
  events: IEvent[];
  created: string;
  isComplete: boolean;
}
