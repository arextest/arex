import { css } from '@emotion/react';
import { Menu, Tag, Typography } from 'antd';
import React, { FC, ReactNode } from 'react';

import { SubScene } from '../../../services/Replay.type';
import { SceneCodeMap } from './index';

export interface SubSceneMenuProps {
  data: SubScene[];
  onClick?: (params: { recordId: string; replayId: string }) => void;
}
const SubSceneMenu: FC<SubSceneMenuProps> = (props) => {
  return (
    <Menu
      css={css`
        border-inline-end: none !important;
      `}
      items={props.data.map((subScene, index) => {
        const fullPath = subScene.details.reduce<ReactNode[]>((path, item, index) => {
          const detail = (
            <>
              <Typography.Text>{item.operationName}</Typography.Text>
              {`${item.categoryName}`}{' '}
              <Tag color={SceneCodeMap[item.code.toString()].color}>
                {SceneCodeMap[item.code.toString()].message}
              </Tag>
            </>
          );
          index && path.push('+ ');
          path.push(detail);
          return path;
        }, []);

        return { label: fullPath, key: subScene.recordId + '%_%' + subScene.replayId };
      })}
      onClick={({ key }) => {
        const split = key.split('%_%');
        if (split.length !== 2) return;

        const [recordId, replayId] = split;
        const params = {
          recordId,
          replayId,
        };

        props.onClick?.(params);
      }}
    />
  );
};

export default SubSceneMenu;
