export interface INavItem {
  name: string;
  action: () => void;
  icon?: JSX.Element;
  itemIsActive: boolean;
}
