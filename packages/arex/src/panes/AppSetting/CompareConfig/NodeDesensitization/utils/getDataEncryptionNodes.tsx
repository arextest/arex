import { Badge } from 'antd';
import { DataNode } from 'antd/lib/tree';
import React from 'react';

import { QueryEncryptionNode } from '@/services/ComparisonService';

import { getArrayValidElement } from '../../NodesSort/utils/getArrayValidElement';

/**
 * 获取 object 的节点，并为已配置过的数组节点添加圆点提示
 * @param object 契约对象
 * @param basePath 节点路径
 * @param desensitizationNodeList 已配置的节点列表
 * @param color 圆点颜色
 */
export function getDataDesensitizationNodes(
  object: object,
  basePath = '',
  desensitizationNodeList?: QueryEncryptionNode[],
  color?: string,
): DataNode[] {
  const entries = Object.entries(object);
  return entries.map(([key, value]) => {
    const losslessValue = value.isLosslessNumber ? value.value : value;

    const path = basePath + '/' + key;
    return losslessValue && typeof losslessValue === 'object'
      ? {
          title: key,
          key: path,
          children: getDataDesensitizationNodes(
            Array.isArray(losslessValue)
              ? getArrayValidElement(losslessValue) || {}
              : losslessValue,
            path,
            desensitizationNodeList,
            color,
          ),
          icon: desensitizationNodeList?.find((node) => '/' + node.path.join('/') === path) && (
            <Badge color={color} /> // 已配置过的节点使用圆点进行提示
          ),
        }
      : {
          title: key,
          key: path,
          value: losslessValue,
          icon: desensitizationNodeList?.find((node) => '/' + node.path.join('/') === path) && (
            <Badge color={color} /> // 已配置过的节点使用圆点进行提示
          ),
        };
  });
}
