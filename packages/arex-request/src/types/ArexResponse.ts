import { ArexRESTResponse } from './ArexRESTResponse';
import { ArexTestResult } from './ArexTestResult';
import { ArexVisualizer } from './ArexVisualizer';

export type ArexResponse = {
  response: ArexRESTResponse;
  testResult: ArexTestResult[];
  consoles: any[];
  visualizer: ArexVisualizer;
};
