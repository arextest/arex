export function calcProgress(statusList: any) {
  const denominator = statusList.reduce((p: any, c: any) => {
    return p + c.count;
  }, 0);
  if (denominator === 0) {
    return 0;
  } else {
    const s2 = statusList.find((status: any) => status.status === 2)?.count || 0;
    const s3 = statusList.find((status: any) => status.status === 3)?.count || 0;
    const s4 = statusList.find((status: any) => status.status === 4)?.count || 0;

    return Number(((s2 + s3 + s4) / denominator).toFixed(2));
  }
}

export function calcProgressDetail(statusList: any) {
  const s2 = statusList.find((status: any) => status.status === 2)?.count || 0;
  const s3 = statusList.find((status: any) => status.status === 3)?.count || 0;
  const s4 = statusList.find((status: any) => status.status === 4)?.count || 0;

  const denominator = statusList.reduce((p: any, c: any) => {
    return p + c.count;
  }, 0);
  return {
    successCaseCount: s2 + s3 + s4,
    totalCaseCount: denominator,
    status: denominator === s2 + s3 + s4 ? 2 : 1,
  };
}
