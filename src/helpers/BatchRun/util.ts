import { treeFindPath } from '../collection/util';

export function genCaseTreeData(data) {
  const cloneData = JSON.parse(JSON.stringify(data));
  const result = [];
  data.forEach((item) => {
    const loop = (data) => {
      result.push({
        id: data.id,
        key: data.key,
        title: data.title + (data.children.length === 0 ? ' (no case)' : ''),
        method: data.method,
        nodeType: data.nodeType,
        disabled: data.children.length === 0,
        path: treeFindPath(cloneData, (node) => node.id === data.id),
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
  return result.filter((i) => i.nodeType === 1);
}
