import { StopOutlined } from '@ant-design/icons';
import { SpaceBetweenWrapper, TooltipButton } from '@arextest/arex-core';
import styled from '@emotion/styled';
import { Typography } from 'antd';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { DiffLog } from './type';

const defaultPath = 'root';

interface PathTitleProps {
  diffLog: DiffLog;
  onIgnore?: (diffLog: DiffLog) => void;
}
const PathTitle = styled((props: PathTitleProps) => {
  const { onIgnore, diffLog, ...restProps } = props;
  const { t } = useTranslation();

  const pathTitle = useCallback((diffLog: DiffLog) => {
    const path = diffLog.nodePath;
    return (
      path.reduce((title, curPair, index) => {
        index && curPair.nodeName && (title += '.');
        title += curPair.nodeName || `[${curPair.index}]`;
        return title;
      }, '') || defaultPath
    );
  }, []);

  return (
    <SpaceBetweenWrapper {...restProps}>
      <Typography.Text ellipsis style={{ color: 'inherit' }}>
        {pathTitle(diffLog)}
      </Typography.Text>
      <TooltipButton
        size='small'
        color='primary'
        placement='right'
        icon={<StopOutlined />}
        title={t('diffPath.ignoreNode')}
        className='menu-item-stop-outlined'
        onClick={() => onIgnore?.(diffLog)}
      />
    </SpaceBetweenWrapper>
  );
})`
  height: 100%;
  .menu-item-stop-outlined {
    padding-right: 8px;
    opacity: 0;
    transition: opacity ease 0.3s;
  }

  &:hover {
    .menu-item-stop-outlined {
      opacity: 1;
    }
  }
`;

export default PathTitle;
