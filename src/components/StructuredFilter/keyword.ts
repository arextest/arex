// category key
export const CategoryKey = {
  LabelKey: 'label',
  IDKey: 'id',
};

// operator
export const Operator = {
  EQ: '==', // equal to
  NE: '!=', // not equal to
  LT: '<', // less than
  lE: '<=', // less than or equal to
  GT: '>', // greater than
  GE: '>=', // greater than or equal to
} as const;

export type OperatorType = (typeof Operator)[keyof typeof Operator];
