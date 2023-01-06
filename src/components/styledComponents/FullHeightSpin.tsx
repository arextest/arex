import styled from '@emotion/styled';
import { Spin, SpinProps } from 'antd';
import React, { FC } from 'react';

const FullHeightSpinWrapper = styled.div`
  height: 100%;
  .full-height-spin {
    height: 100%;
    .ant-spin-container {
      height: 100%;
    }
  }
`;

const FullHeightSpin: FC<SpinProps> = (props) => {
  const { wrapperClassName, ...restProps } = props;
  return (
    <FullHeightSpinWrapper>
      <Spin
        wrapperClassName={`full-height-spin ${wrapperClassName ? wrapperClassName : ''}`}
        {...restProps}
      />
    </FullHeightSpinWrapper>
  );
};

export default FullHeightSpin;
