export interface ITutorialSection {
  category: string;
  icon: JSX.Element;
  tutorials: ITutorial[];
}

export interface ITutorial {
  formID: string;
  docsURL: string;
  endpoint?: string;
  form: JSX.Element;
  runnable: boolean;
  shortInfo: string;
  title: string;
}
