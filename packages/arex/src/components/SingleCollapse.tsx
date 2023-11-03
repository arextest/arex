import { css } from '@arextest/arex-core';
import { Collapse, CollapseProps } from 'antd';
import React, { FC, ReactNode } from 'react';

const SingleCollapse: FC<
  Omit<CollapseProps, 'items'> & {
    defaultActive?: boolean;
    item: {
      key: string;
      label: ReactNode;
      children: ReactNode;
    };
  }
> = (props) => (
  <Collapse
    bordered={false}
    defaultActiveKey={props.defaultActive ? [props.item.key] : undefined}
    items={[props.item]}
    css={css`
      .ant-collapse-header-text {
        font-weight: 600;
      }
    `}
  />
);

export default SingleCollapse;
