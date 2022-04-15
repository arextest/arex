export const getCasePassRate = (total: number, success: number, error: number, showPercentSign: boolean = true) => {
  let value = success && (total - error) ? parseFloat((success / (total - error) * 100).toFixed(2)) : 0;
  return showPercentSign ? value + "%" : value;
};
