interface Status {
  count: number;
  status: number;
  caseIdList: string[];
}
interface Interface {
  statusList: Status[];
}
export function getIncompleteKeys(data: Interface[]) {
  let keys: any = [];
  let allKeys: any = [];
  data.forEach((d) => {
    d.statusList
      .filter((f) => f.status === 0)
      .forEach((d2) => {
        keys = [...keys, ...d2.caseIdList];
      });
  });

  data.forEach((d) => {
    d.statusList.forEach((d2) => {
      allKeys = [...allKeys, ...d2.caseIdList];
    });
  });
  console.log(`一共${allKeys.length}个case，正在上传剩余${keys.length}`);
  return keys;
}
