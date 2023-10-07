export type EnvironmentKeyValues = { key: string; value: string };

export type ArexEnvironment = {
  id: string;
  name: string;
  variables?: EnvironmentKeyValues[];
};
