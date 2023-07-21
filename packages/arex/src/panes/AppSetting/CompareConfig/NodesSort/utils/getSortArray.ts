import { NodesSortProps } from '@/panes/AppSetting/CompareConfig/NodesSort';
import { getArrayValidElement } from '@/panes/AppSetting/CompareConfig/NodesSort/utils/getArrayValidElement';

/**
 * 根据 path获取 contract 的非数组元素节点
 * @param key
 * @param contract
 */
export function getSortArray(key: string, contract: NodesSortProps['contractParsed']) {
  let value: any = undefined;
  key
    .split('/')
    .filter(Boolean)
    .forEach((k, i) => {
      value =
        i === 0 ? contract[k] : Array.isArray(value) ? getArrayValidElement(value)?.[k] : value[k];
    });

  return value;
}
