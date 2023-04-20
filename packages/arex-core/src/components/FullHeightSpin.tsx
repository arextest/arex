import styled from '@emotion/styled';
import { Spin, SpinProps } from 'antd';
import React, { FC } from 'react';

const FullHeightSpinWrapper = styled.div<{ minHeight?: number }>`
  height: 100%;
  .full-height-spin {
    height: 100%;
    min-height: ${(props) => props.minHeight || 0}px;
    .ant-spin-container {
      height: 100%;
    }
  }
`;

export interface FullHeightSpinProps extends SpinProps {
  minHeight?: number;
  mountOnFirstLoading?: boolean;
}

const FullHeightSpin: FC<FullHeightSpinProps> = (props) => {
  const { minHeight, wrapperClassName, mountOnFirstLoading = true, children, ...restProps } = props;
  return (
    <FullHeightSpinWrapper minHeight={minHeight}>
      <Spin
        wrapperClassName={`full-height-spin ${wrapperClassName ? wrapperClassName : ''}`}
        {...restProps}
      >
        {mountOnFirstLoading ? children : props.spinning === false && children}
      </Spin>
    </FullHeightSpinWrapper>
  );
};

export default FullHeightSpin;
