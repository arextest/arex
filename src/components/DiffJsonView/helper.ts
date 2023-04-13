import { LogEntity } from '../../services/Replay.type';

export function genAllDiffByType(logs?: LogEntity) {
  const allDiff: Record<string, (string | number)[][]> = {
    diff012: [],
    diff3: [],
    diff012Ig: [],
    diff3Ig: [],
  };

  if (!logs) return allDiff;

  const leftArr = [];
  for (let i = 0; i < logs.pathPair.leftUnmatchedPath.length; i++) {
    leftArr.push(
      logs.pathPair.leftUnmatchedPath[i].nodeName
        ? logs.pathPair.leftUnmatchedPath[i].nodeName
        : logs.pathPair.leftUnmatchedPath[i].index,
    );
  }
  const rightArr = [];
  for (let i = 0; i < logs.pathPair.rightUnmatchedPath.length; i++) {
    rightArr.push(
      logs.pathPair.rightUnmatchedPath[i].nodeName
        ? logs.pathPair.rightUnmatchedPath[i].nodeName
        : logs.pathPair.rightUnmatchedPath[i].index,
    );
  }
  // public static final int LEFT_MISSING = 1;
  // public static final int RIGHT_MISSING = 2
  //   0 是不匹配
  const unmatchedTypes = [0, 1, 2];
  if (logs.logTag.ig) {
    if (unmatchedTypes.includes(logs.pathPair.unmatchedType)) {
      allDiff.diff012Ig.push(leftArr.length > rightArr.length ? leftArr : rightArr);
    } else {
      allDiff.diff3Ig.push(leftArr);
      allDiff.diff3Ig.push(rightArr);
    }
  } else {
    if (unmatchedTypes.includes(logs.pathPair.unmatchedType)) {
      allDiff.diff012.push(leftArr.length > rightArr.length ? leftArr : rightArr);
    } else {
      allDiff.diff3.push(leftArr);
      allDiff.diff3.push(rightArr);
    }
  }

  return allDiff;
}
