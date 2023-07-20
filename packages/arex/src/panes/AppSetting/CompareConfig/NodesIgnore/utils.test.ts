import { tryParseJsonString } from '@arextest/arex-core/src/utils/json';
import { describe, expect, test } from 'vitest';

import { getNodes } from './utils';
describe('convert sort tree', () => {
  test('simple object', () => {
    const objectData = { name: 'Helen', age: 20 };
    expect(getNodes(objectData)).toMatchSnapshot();
  });

  test('complex object', () => {
    const objectData = {
      name: 'Helen',
      age: 20,
      hobby: ['music', 'football'],
      assets: {
        house: 'shanghai',
        car: ['BMW', 'Benz'],
        savings: 1000000,
      },
    };
    expect(getNodes(objectData)).toMatchSnapshot();
  });

  test('lossless json string', () => {
    const jsonString = '{"name":"Helen","age":20.00000000}';
    expect(getNodes(tryParseJsonString(jsonString) as object)).toMatchSnapshot();
  });
});
