import styled from '@emotion/styled';
import { Skeleton } from 'antd';
import React, { FC } from 'react';

const EditAreaPlaceholderWrapper = styled.div`
  flex: 1;
  padding: 0 16px;

  h3 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dashed-border {
    height: 300px;
    border: 2px ${(props) => props.theme.color.border.primary} dashed;
    border-radius: 8px;
    padding: 16px;
  }
`;

const EditAreaPlaceholder: FC = () => {
  return (
    <EditAreaPlaceholderWrapper>
      <h3> Edit Area (Click interface to start)</h3>
      <div className='dashed-border'>
        <Skeleton />
        <Skeleton />
      </div>
    </EditAreaPlaceholderWrapper>
  );
};

export default EditAreaPlaceholder;
