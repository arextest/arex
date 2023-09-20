export type EnvironmentKeyValues = { key: string; value: string };

export type Environment = {
  id: string;
  name: string;
  variables?: EnvironmentKeyValues[];
};
