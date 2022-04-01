export interface ITutorialSection {
  title: string;
  tutorials: ITutorial[];
}

export interface ITutorial {
  docsURL: string;
  endpoint: string;
  form: JSX.Element;
  link: string;
  shortInfo: string;
  title: string;
}
