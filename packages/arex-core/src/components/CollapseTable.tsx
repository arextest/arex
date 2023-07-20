import { css } from '@emotion/react';
import { Collapse, CollapseProps } from 'antd';
import React, { FC, ReactNode } from 'react';

export type CollapseTableProps = {
  active: boolean;
  table: ReactNode;
  panel: ReactNode;
} & CollapseProps;

const CollapseTable: FC<CollapseTableProps> = (props) => {
  const { active, table, panel, ...restProps } = props;
  return (
    <Collapse
      destroyInactivePanel
      className='collapse-table'
      activeKey={active ? 'report' : 'none'}
      items={[
        {
          key: 'report',
          label: table,
          showArrow: false,
          children: panel,
        },
      ]}
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
    />
  );
};

export default CollapseTable;
