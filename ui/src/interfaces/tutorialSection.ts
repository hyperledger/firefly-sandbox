export interface ITutorialSection {
  category: string;
  icon: JSX.Element;
  tutorials: ITutorial[];
}

export interface ITutorial {
  docsURL: string;
  endpoint?: string;
  form: JSX.Element;
  formID: string;
  icon: JSX.Element;
  runnable: boolean;
  shortInfo: string;
  title: string;
}
