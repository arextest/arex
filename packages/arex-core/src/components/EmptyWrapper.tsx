import { Empty, EmptyProps } from 'antd';
import React, { FC } from 'react';

import FlexCenterWrapper from './FlexCenterWrapper';
import { FullHeightSpin } from './index';

export type EmptyWrapperProps = {
  empty?: boolean;
  loading?: boolean;
  loadingTip?: React.ReactNode;
} & EmptyProps;

const EmptyWrapper: FC<EmptyWrapperProps> = (props) => {
  const { empty = true, loading = false, loadingTip, children, ...emptyProps } = props;
  return (
    <FullHeightSpin spinning={loading} tip={loadingTip} className={props.className}>
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
