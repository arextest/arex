import { SpaceBetweenWrapper, styled } from '@arextest/arex-core';
import { Typography } from 'antd';
import React, { useCallback } from 'react';

import { DiffLog } from '@/services/ReportService';

const defaultPath = 'root';

interface PathTitleProps {
  diffLog: DiffLog;
}
const PathTitle = styled((props: PathTitleProps) => {
  const { diffLog, ...restProps } = props;

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
