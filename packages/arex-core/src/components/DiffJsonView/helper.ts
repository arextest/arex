import { LogEntity } from '../DiffPath/type';
export const DIFF_TYPE = {
  LEFT_MISSING: 1,
  RIGHT_MISSING: 2,
  UNMATCHED: 3,
};

export type AllDiff = { more: React.Key[][]; diff: React.Key[][] };

export function genAllDiffByType(type: 'left' | 'right', logs?: LogEntity[]) {
  const allDiff: AllDiff = {
    more: [],
    diff: [],
  };
  if (!logs || !logs.length) return allDiff;
  for (let j = 0; j < logs.length; j++) {
    const arr: React.Key[] = [];
    for (let i = 0; i < logs[j].pathPair[`${type}UnmatchedPath`].length; i++) {
      arr.push(
        logs[j].pathPair[`${type}UnmatchedPath`][i].nodeName
          ? logs[j].pathPair[`${type}UnmatchedPath`][i].nodeName
          : logs[j].pathPair[`${type}UnmatchedPath`][i].index,
      );
    }
    if (!logs[j].logTag.ig) {
      if (
        [DIFF_TYPE.LEFT_MISSING, DIFF_TYPE.RIGHT_MISSING].includes(logs[j].pathPair.unmatchedType)
      ) {
        allDiff.more.push(arr);
      } else if ([DIFF_TYPE.UNMATCHED].includes(logs[j].pathPair.unmatchedType)) {
        allDiff.diff.push(arr);
      }
    }
  }
  return allDiff;
}
