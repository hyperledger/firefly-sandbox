export interface IBlockchainCategory {
  category: string;
  color: string;
  enrichedEventKey?: string;
  enrichedEventString?: (key: any) => string;
  nicename: string;
}

export interface IDataListItem {
  label: string | JSX.Element;
  value: string | JSX.Element | number | undefined;
  button?: JSX.Element | undefined;
}
