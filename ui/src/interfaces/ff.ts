export interface IBlockchainCategory {
  category: string;
  color: string;
  enrichedEventKey?: string;
  enrichedEventString?: (key: any) => string;
  nicename: string;
}
