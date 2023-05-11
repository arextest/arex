// category key
export const CategoryKey = {
  Label: 'label',
  Id: 'id',
  Keyword: 'keyword',
};

// operator
export const Operator = {
  EQ: '=', // equal to
  NE: '!=', // not equal to
  LT: '<', // less than
  lE: '<=', // less than or equal to
  GT: '>', // greater than
  GE: '>=', // greater than or equal to
} as const;

export type OperatorType = typeof Operator[keyof typeof Operator];
