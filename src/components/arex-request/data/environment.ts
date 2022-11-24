export type Environment = {
  name: string;
  variables: {
    key: string;
    value: string;
  }[];
};

const REGEX_ENV_VAR = /{{([^>]*)}}/g; // "{{myVariable}}"
