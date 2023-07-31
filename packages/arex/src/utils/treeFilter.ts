import { debounce } from 'lodash';

export default function treeFilter<T extends { [key: string]: any; children: T[] }>(
  value: string,
  arr: T[],
  nodeName = 'title',
): T[] {
  return arr.filter((item) => {
    if (item.children?.length) {
      item.children = treeFilter(value, item.children, nodeName);
    }
    return (
      item[nodeName].toLowerCase().includes(value.trim().toLowerCase()) || item.children?.length
    );
  });
}

export const treeFilterDebounced = debounce(treeFilter, 300);
