/**
 * @param weekArray weekArray.length === 7
 */
export const encodeWeekCode = (weekArray: number[]) => {
  return parseInt(
    Array(7)
      .fill(0)
      .map((n, i) => Number(weekArray.includes(i)))
      .reverse()
      .join(''),
    2,
  );
};

/**
 * @param weekCode range [0, 127]
 */
export const decodeWeekCode = (weekCode: number) => {
  const allowDayOfWeeks: number[] = [];
  weekCode
    .toString(2)
    .split('')
    .reverse()
    .forEach((status, index) => status === '1' && allowDayOfWeeks.push(index));

  return allowDayOfWeeks;
};
