import { ArexVisualizer } from './ArexVisualizer';

export interface ArexTestResult {
  async: boolean;
  error: null | {
    name: string;
    message: string;
    showDiff: boolean;
    actual: number;
    expected: number;
    stack: string;
  };
  index: number;
  name: string;
  passed: boolean;
  skipped: boolean;
  consoles: any[];
  visualizer: ArexVisualizer;
}
