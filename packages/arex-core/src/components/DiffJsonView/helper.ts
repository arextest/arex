// import { LogEntity } from '../../services/Replay.type';
// public static final int LEFT_MISSING = 1;
// public static final int RIGHT_MISSING = 2;
// public static final int UNMATCHED = 3;
import { LogEntity } from '../DiffPath/type';

export function genAllLeftDiffByType(logs?: LogEntity[]) {
  const allDiff: any = {
    more: [],
    diff: [],
  };
  if (!logs || !logs.length) return allDiff;
  for (let j = 0; j < logs.length; j++) {
    const leftArr = [];
    for (let i = 0; i < logs[j].pathPair.leftUnmatchedPath.length; i++) {
      leftArr.push(
        logs[j].pathPair.leftUnmatchedPath[i].nodeName
          ? logs[j].pathPair.leftUnmatchedPath[i].nodeName
          : logs[j].pathPair.leftUnmatchedPath[i].index,
      );
    }
    if (!logs[j].logTag.ig) {
      if ([1, 2].includes(logs[j].pathPair.unmatchedType)) {
        allDiff.more.push(leftArr);
      } else if ([3].includes(logs[j].pathPair.unmatchedType)) {
        allDiff.diff.push(leftArr);
      }
    }
  }
  return allDiff;
}

export function genAllRightDiffByType(logs?: LogEntity[]) {
  const allDiff: any = {
    more: [],
    diff: [],
  };
  if (!logs || !logs.length) return allDiff;
  for (let j = 0; j < logs.length; j++) {
    const rightArr = [];
    for (let i = 0; i < logs[j].pathPair.rightUnmatchedPath.length; i++) {
      rightArr.push(
        logs[j].pathPair.rightUnmatchedPath[i].nodeName
          ? logs[j].pathPair.rightUnmatchedPath[i].nodeName
          : logs[j].pathPair.rightUnmatchedPath[i].index,
      );
    }
    if (!logs[j].logTag.ig) {
      if ([1, 2].includes(logs[j].pathPair.unmatchedType)) {
        allDiff.more.push(rightArr);
      } else if ([3].includes(logs[j].pathPair.unmatchedType)) {
        allDiff.diff.push(rightArr);
      }
    }
  }
  return allDiff;
}
