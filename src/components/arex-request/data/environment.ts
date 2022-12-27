export type Environment = {
  name: string;
  variables: {
    key: string;
    value: string;
  }[];
};

export const REGEX_ENV_VAR = /{{([^>]*)}}/g; // "{{myVariable}}"
