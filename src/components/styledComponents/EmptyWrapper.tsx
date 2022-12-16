import { Empty, EmptyProps } from 'antd';
import React from 'react';

import { FCC } from '../../env';
import FlexCenterWrapper from './FlexCenterWrapper';
import { FullHeightSpin } from './index';

const EmptyWrapper: FCC<{ empty?: boolean; loading?: boolean } & EmptyProps> = (props) => {
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
