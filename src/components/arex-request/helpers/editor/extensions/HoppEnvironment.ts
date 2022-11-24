// @ts-nocheck
export const HOPP_ENVIRONMENT_REGEX = /\{\{(.+?)\}\}/g;
// 获取文本标志位坐标数组
export const getMarkFromToArr = (
  text: string,
  reg: RegExp,
  currentEnv: {
    envName: string;
    keyValues: {
      key: string;
      value: string;
    }[];
  },
): {
  from: number;
  to: number;
  found: boolean;
  matchEnv: {
    name: string;
    key: string;
    value: string;
  };
}[] => {
  // ssss
  const editorValueMatch = text.match(reg) || [];
  const arr = [];
  for (let i = 0; i < editorValueMatch.length; i++) {
    const find = currentEnv.keyValues.find(
      (f) => f.key === editorValueMatch[i].replace('{{', '').replace('}}', ''),
    );
    arr.push({
      from: text.indexOf(editorValueMatch[i]),
      to: text.indexOf(editorValueMatch[i]) + editorValueMatch[i].length,
      found: find ? true : false,
      matchEnv: {
        name: currentEnv.envName || 'choose an environment',
        key: find ? find.key : 'not found',
        value: find ? find.value : 'not found',
      },
    });
  }
  return arr;
};
