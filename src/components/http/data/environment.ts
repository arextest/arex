import { EnvironmentKeyValues } from '../../../services/Environment.type';

export type Environment = {
  name: string;
  variables: EnvironmentKeyValues[];
};

export const REGEX_ENV_VAR = /{{([^>]*)}}/g; // "{{myVariable}}"
