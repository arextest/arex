import { Card, Empty, EmptyProps } from 'antd';
import React, { FC, FunctionComponent } from 'react';

import FlexCenterWrapper from './FlexCenterWrapper';
import { FullHeightSpin } from './index';

export type EmptyWrapperProps = {
  empty?: boolean;
  loading?: boolean;
  bordered?: boolean;
  loadingTip?: React.ReactNode;
} & EmptyProps;

const EmptyWrapper: FC<EmptyWrapperProps> = (props) => {
  const {
    empty = true,
    loading = false,
    bordered = false,
    loadingTip,
    children,
    ...emptyProps
  } = props;
  return (
    <FullHeightSpin spinning={loading} tip={loadingTip} className={props.className}>
      {empty ? (
        React.createElement(
          bordered ? Card : (FlexCenterWrapper as FunctionComponent),
          { bordered },
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} {...emptyProps} />,
        )
      ) : (
        <>{children}</>
      )}
    </FullHeightSpin>
  );
};

export default EmptyWrapper;
