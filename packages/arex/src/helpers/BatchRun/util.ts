// @ts-nocheck
export function genCaseTreeData(data: any) {
  const result = [];
  data.forEach((item) => {
    const loop = (data) => {
      result.push({
        id: data.infoId,
        key: data.infoId,
        title: data.nodeName + (data?.children?.length === 0 ? ' (no case)' : ''),
        method: data.method,
        nodeType: data.nodeType,
        disabled: data?.children?.length === 0,
        children: data.children,
      });
      const child = data.children;
      if (child) {
        for (let i = 0; i < child.length; i++) {
          loop(child[i]);
        }
      }
    };
    loop(item);
  });

  const interfaceResult = result.filter((i) => i.nodeType === 1);

  const finInterfaceResult = [];

  for (let i = 0; i < interfaceResult.length; i++) {
    finInterfaceResult.push({
      key: interfaceResult[i].key,
      title: interfaceResult[i].title,
      children: [],
    });
    for (let j = 0; j < (interfaceResult[i].children || []).length; j++) {
      finInterfaceResult[i].children.push({
        key: interfaceResult[i].children[j].infoId,
        title: interfaceResult[i].children[j].nodeName,
      });
    }
  }

  return finInterfaceResult;
}
