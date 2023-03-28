// 数组转树通用方法
import { SearchDataType } from '../../components/StructuredFilter';
import { CategoryKey, Operator } from '../../components/StructuredFilter/keyword';
import { NodeObject } from '../../services/Collection.service';
import { negate } from '../utils';

export function arrToTree(arr: any, pid = 0) {
  const newArr: any = [];
  arr.forEach((item: any) => {
    if (item.pid === pid) {
      newArr.push({
        ...item,
        children: arrToTree(arr, item.id),
      });
    }
  });
  return newArr;
}

// 根据id查询返回每一级数据

export function treeFindPath<T>(
  tree: T[],
  func: (item: T) => boolean,
  path: any = [],
): {
  title: string;
  key: string;
  nodeType: number;
}[] {
  if (!tree) {
    return [];
  }
  for (const data of tree) {
    // 假设满足条件,直接放到数组里

    path.push({
      // @ts-ignore
      title: data.title,
      // @ts-ignore
      key: data.key,
      // @ts-ignore
      nodeType: data.nodeType,
    });
    if (func(data)) {
      return path;
    }
    // @ts-ignore
    if (data.children) {
      // @ts-ignore
      const res = treeFindPath(data.children, func, path);
      if (res.length) {
        return res;
      }
    }
    path.pop();
  }
  return [];
}

export function treeFind<T>(tree: T[], func: (item: T) => boolean): T | undefined {
  for (const data of tree) {
    if (func(data)) return data;
    // @ts-ignore
    if (data.children) {
      // @ts-ignore
      const res = treeFind(data.children, func);
      if (res) return res;
    }
  }
  return undefined;
}

export function collectionOriginalTreeToAntdTreeData(
  tree: any,
  nodeList: NodeObject[] = [],
): NodeObject[] {
  const nodes = tree;
  Object.keys(nodes).forEach((value, index) => {
    nodeList.push({
      id: nodes[value].infoId,
      children: [],
      // 自定义
      labelIds: nodes[value].labelIds,
      title: nodes[value].nodeName,
      key: nodes[value].infoId,
      nodeType: nodes[value].nodeType,
      method: nodes[value].method,
      caseSourceType: nodes[value].caseSourceType,
      // isLeaf: nodes[value].nodeType === 2||nodes[value].children==null
      // icon: iconMap[nodes[value].nodeType],
    });
    if (nodes[value].children && Object.keys(nodes[value].children).length > 0) {
      collectionOriginalTreeToAntdTreeData(nodes[value].children, nodeList[index].children);
    }
  });
  return nodeList;
}

export function treeFindAllKeys(tree: any, allKeys = []) {
  for (const treeElement of tree) {
    // @ts-ignore
    allKeys.push(treeElement.key);
    if (treeElement.children) {
      treeFindAllKeys(treeElement.children, allKeys);
    }
  }
  return allKeys;
}

export const filterTree = (val: SearchDataType = {}, tree: any, newArr: any = []) => {
  const { keyword, structuredValue = [] } = val;

  if (!keyword && !structuredValue?.length) {
    // 如果搜索关键字为空直接返回源数据
    return tree;
  }

  for (const item of tree) {
    let filtered = keyword && !!item.title.includes(keyword);

    for (let i = 0; i < structuredValue.length; i++) {
      const structured = structuredValue[i];

      if (structured.category === CategoryKey.LabelKey) {
        // search for labelIds
        const include = negate(
          item.labelIds?.includes(structured.value as string),
          structured.operator === Operator.NE,
        );

        if (include) {
          filtered = true;
        }
      } else if (structured.category === CategoryKey.IDKey) {
        // search for id
        const include = negate(
          item.key.includes(structured.value as string),
          structured.operator === Operator.NE,
        );
        if (include) {
          filtered = true;
        }
      }
    }

    if (filtered) {
      // 匹配到关键字的逻辑
      newArr.push(item); // 如果匹配到就在数值中添加记录
      continue; // 匹配到了就退出循环了此时如果有子集也会一并带着
    }

    if (item.children && item.children.length) {
      // 如果父级节点没有匹配到就看看是否有子集，然后做递归
      const subArr = filterTree(val, item.children); // 缓存递归后的子集数组
      if (subArr && subArr.length) {
        // 如果子集数据有匹配到的节点
        const node = { ...item, children: subArr }; // 关键逻辑，缓存父节点同时将递归后的子节点作为新值
        newArr.push(node); // 添加进数组
      }
    }
  }
  return newArr;
};
