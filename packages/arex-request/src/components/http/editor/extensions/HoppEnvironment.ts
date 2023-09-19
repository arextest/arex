export const HOPP_ENVIRONMENT_REGEX = /\{\{(.+?)\}\}/g;
// 获取文本标志位坐标数组
export const getMarkFromToArr = (
  text: string,
  reg: RegExp,
  currentEnv: {
    name: string;
    variables: {
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
  const editorValueMatch = text.match(reg) || [];
  const arr = [];

  let cloneText = text;

  for (let i = 0; i < editorValueMatch.length; i++) {
    const find = currentEnv.variables.find(
      (f) => f.key === editorValueMatch[i].replace('{{', '').replace('}}', ''),
    );
    arr.push({
      from: cloneText.indexOf(editorValueMatch[i]),
      to: cloneText.indexOf(editorValueMatch[i]) + editorValueMatch[i].length,
      found: find ? true : false,
      matchEnv: {
        name: currentEnv.name || 'choose an environment',
        key: find ? find.key : 'not found',
        value: find ? find.value : 'not found',
      },
    });
    cloneText = cloneText.replace(
      editorValueMatch[i],
      [...Array(editorValueMatch[i].length)].map((a) => '*').join(''),
    );
  }
  return arr;
};
