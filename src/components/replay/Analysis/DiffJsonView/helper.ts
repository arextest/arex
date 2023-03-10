import { DiffLog } from '../../../../services/Replay.type';

export function genAllDiffByType(logs?: DiffLog[]) {
  const allDiff: any = {
    diff012: [],
    diff3: [],
    diff012Ig: [],
    diff3Ig: [],
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
    const rightArr = [];
    for (let i = 0; i < logs[j].pathPair.rightUnmatchedPath.length; i++) {
      rightArr.push(
        logs[j].pathPair.rightUnmatchedPath[i].nodeName
          ? logs[j].pathPair.rightUnmatchedPath[i].nodeName
          : logs[j].pathPair.rightUnmatchedPath[i].index,
      );
    }
    // public static final int LEFT_MISSING = 1;
    // public static final int RIGHT_MISSING = 2
    //   0 是不匹配
    const unmatchedTypes = [0, 1, 2];
    if (logs[j].logTag.ig) {
      if (unmatchedTypes.includes(logs[j].pathPair.unmatchedType)) {
        allDiff.diff012Ig.push(leftArr.length > rightArr.length ? leftArr : rightArr);
      } else {
        allDiff.diff3Ig.push(leftArr);
        allDiff.diff3Ig.push(rightArr);
      }
    } else {
      if (unmatchedTypes.includes(logs[j].pathPair.unmatchedType)) {
        allDiff.diff012.push(leftArr.length > rightArr.length ? leftArr : rightArr);
      } else {
        allDiff.diff3.push(leftArr);
        allDiff.diff3.push(rightArr);
      }
    }
  }
  return allDiff;
}
