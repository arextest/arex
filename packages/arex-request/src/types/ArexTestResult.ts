import { ArexVisualizer } from './ArexVisualizer';

export interface ArexTestResult {
  async: boolean;
  error: string | null;
  index: number;
  name: string;
  passed: boolean;
  skipped: boolean;
  consoles: any[];
  visualizer: ArexVisualizer;
}
