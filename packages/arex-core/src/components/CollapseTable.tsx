import { css } from '@emotion/react';
import { Collapse, CollapseProps } from 'antd';
import React, { FC, ReactNode } from 'react';

export type CollapseTableProps = {
  active: boolean;
  table: ReactNode;
  panel: ReactNode;
} & CollapseProps;

const { Panel } = Collapse;

const CollapseTable: FC<CollapseTableProps> = (props) => {
  const { active, table, panel, ...restProps } = props;
  return (
    <Collapse
      className='collapse-table'
      activeKey={active ? 'report' : 'none'}
      css={css`
        .ant-collapse-content-box {
          padding: 0 !important;
          .ant-card-head-title {
            font-size: 16px;
          }
        }
        &.collapse-table {
          margin-bottom: 16px;
          & > .ant-collapse-item > .ant-collapse-header {
            cursor: default; // 只作用于顶层
            .ant-collapse-header-text {
              width: 100%;
            }
          }
        }
      `}
      {...restProps}
    >
      <Panel key='report' showArrow={false} header={table}>
        {panel}
      </Panel>
    </Collapse>
  );
};

export default CollapseTable;
