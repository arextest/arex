
export function processTreeData(treeData: any, depthLimit = 10, currentDepth = 0) {
  if (currentDepth >= depthLimit) {
    // 达到递归深度上限，停止递归
    return treeData;
  }
  return treeData.map((c: any) => {
    return {
      title: c.nodeName,
      value: c.infoId,
      disabled: c.nodeType !== 3,
      nodeType: c.nodeType,
      children: processTreeData(c.children || [], depthLimit, currentDepth + 1), // 递归调用，增加当前深度
    };
  });
}
