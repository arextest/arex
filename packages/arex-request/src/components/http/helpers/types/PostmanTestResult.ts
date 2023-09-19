export interface PostmanTestResult {
  async: boolean;
  error: string | null;
  index: number;
  name: string;
  passed: boolean;
  skipped: boolean;
}
