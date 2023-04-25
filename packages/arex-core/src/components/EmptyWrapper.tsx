import { Empty, EmptyProps } from 'antd';
import React, { FC } from 'react';

import FlexCenterWrapper from './FlexCenterWrapper';
import { FullHeightSpin } from './index';

export type EmptyWrapperProps = {
  empty?: boolean;
  loading?: boolean;
} & EmptyProps;

const EmptyWrapper: FC<EmptyWrapperProps> = (props) => {
  const { empty = true, loading = false, children, ...emptyProps } = props;
  return (
    <FullHeightSpin spinning={loading}>
      {empty ? (
        <FlexCenterWrapper>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} {...emptyProps} />
        </FlexCenterWrapper>
      ) : (
        <>{children}</>
      )}
    </FullHeightSpin>
  );
};

export default EmptyWrapper;
