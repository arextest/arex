import { CloseOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button } from 'antd';
import React, { FC, ReactNode, useEffect } from 'react';

type FullScreenProps = {
  title?: ReactNode;
  children?: ReactNode;
  visible?: boolean;
  onClose?: () => void;
};

const FullScreenWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: ${(props) => props.theme.color.background.primary};
  .header {
    margin: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const FullScreen: FC<FullScreenProps> = (props) => {
  useEffect(() => {
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        props.onClose && props.onClose();
      }
    });
  }, []);

  return props.visible ? (
    <FullScreenWrapper>
      <div className='header'>
        <span>{props.title}</span>
        <Button size='small' icon={<CloseOutlined />} onClick={props.onClose}></Button>
      </div>

      {props.children}
    </FullScreenWrapper>
  ) : (
    <></>
  );
};

export default FullScreen;
