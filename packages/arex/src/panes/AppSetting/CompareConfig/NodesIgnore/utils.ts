import { DataNode } from 'antd/lib/tree';

export function getNodes(object: object, basePath = ''): DataNode[] {
  const entries = Object.entries(object);
  return entries.map(([key, value]) => {
    const losslessValue = value.isLosslessNumber ? value.value : value;
    const isSimpleArray =
      Array.isArray(losslessValue) && ['number', 'string'].includes(typeof losslessValue[0]);
    const isObject = typeof losslessValue === 'object';

    const path = basePath + key + '/';

    return losslessValue && isObject && !isSimpleArray
      ? {
          title: key,
          key: path,
          children: getNodes(
            Array.isArray(losslessValue) ? losslessValue[0] || {} : losslessValue,
            path,
          ),
        }
      : { title: key, key: path, value: losslessValue };
  });
}
