import { css } from '@emotion/react';
import { Collapse } from 'antd';
import React, { FC, ReactNode } from 'react';

export type CollapseTableProps = {
  active: boolean;
  table: ReactNode;
  panel: ReactNode;
};

const { Panel } = Collapse;

const CollapseTable: FC<CollapseTableProps> = (props) => {
  return (
    <Collapse
      className='collapse-table'
      activeKey={props.active ? 'report' : 'none'}
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
          }
        }
      `}
    >
      <Panel key='report' showArrow={false} header={props.table}>
        {props.panel}
      </Panel>
    </Collapse>
  );
};

export default CollapseTable;
