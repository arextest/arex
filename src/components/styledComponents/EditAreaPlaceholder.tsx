// @ts-nocheck
import styled from '@emotion/styled';
import { Skeleton } from 'antd';
import React, { FC, ReactNode } from 'react';

const EditAreaPlaceholderWrapper = styled.div<{ dashedBorder?: boolean }>`
  h3 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dashed-border {
    height: 300px;
    border: ${(props) => (props.dashedBorder ? `2px ${props.theme.colorBorder} dashed` : 'none')};
    border-radius: 8px;
    padding: 16px;
  }
`;

type EditAreaPlaceholderProps = {
  title: string;
  ready?: boolean;
  dashedBorder?: boolean;
  children?: ReactNode;
};

const EditAreaPlaceholder: FC<EditAreaPlaceholderProps> = (props) => {
  return props.ready ? (
    <div>{props.children}</div>
  ) : (
    <EditAreaPlaceholderWrapper dashedBorder={props.dashedBorder}>
      <h3> {props.title}</h3>
      <div className='dashed-border'>
        <Skeleton />
        <Skeleton />
      </div>
    </EditAreaPlaceholderWrapper>
  );
};

export default EditAreaPlaceholder;
