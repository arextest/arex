import { css } from '@emotion/react';
import { Menu, Space, Tag } from 'antd';
import React, { FC, ReactNode, useEffect, useState } from 'react';

import { SubScene } from '../../../services/Replay.type';
import { SceneCodeMap } from './index';

export interface SubSceneMenuProps {
  data: SubScene[];
  onClick?: (params: { recordId: string; replayId: string }) => void;
}

const Connector = '%_%';
const SubSceneMenu: FC<SubSceneMenuProps> = (props) => {
  const [selectedKeys, setSelectedKeys] = useState('');

  useEffect(() => {
    if (props.data.length) {
      const params = {
        recordId: props.data[0].recordId,
        replayId: props.data[0].replayId,
      };
      setSelectedKeys(params.recordId + Connector + params.replayId);
      props.onClick?.(params);
    }
  }, [props.data]);

  return (
    <Menu
      selectedKeys={[selectedKeys]}
      items={props.data.map((subScene) => {
        const fullPath = subScene.details.reduce<ReactNode[]>((path, item, index) => {
          const detail = (
            <Space>
              {`${item.operationName}-${item.categoryName}`}
              <Tag color={SceneCodeMap[item.code.toString()].color}>
                {SceneCodeMap[item.code.toString()].message}
              </Tag>
            </Space>
          );
          index && path.push('+ ');
          path.push(detail);
          return path;
        }, []);

        return { label: fullPath, key: subScene.recordId + Connector + subScene.replayId };
      })}
      onClick={({ key }) => {
        setSelectedKeys(key);
        const split = key.split('%_%');
        if (split.length !== 2) return;

        const [recordId, replayId] = split;
        const params = {
          recordId,
          replayId,
        };

        props.onClick?.(params);
      }}
      css={css`
        border-inline-end: none !important;
      `}
    />
  );
};

export default SubSceneMenu;
