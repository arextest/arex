/**
 * Sorts an array based on the sort func.
 * Unsafe because this sort mutates the passed array
 * and returns it. So use it if you do not want the
 * original array for better performance
 * @param sortFunc sort function to sort against (same as Array.sort)
 */
export const arrayUnsafeSort =
  <T>(sortFunc: (a: T, b: T) => number) =>
  (arr: T[]) => {
    arr.sort(sortFunc);

    return arr;
  };

/**
 * Equivalent to `Array.prototype.flatMap`
 * @param mapFunc The map function
 * @returns
 */
export const arrayFlatMap =
  <T, U>(mapFunc: (value: T, index: number, arr: T[]) => U[]) =>
  (arr: T[]) =>
    arr.flatMap(mapFunc);

export const stringArrayJoin = (separator: string) => (arr: string[]) => arr.join(separator);
