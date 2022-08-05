import styled from '@emotion/styled';
import { Button, Input, Modal } from 'antd';
import React, { FC, useState } from 'react';

import { Label } from '../styledComponents';

type AppTitleData = {
  id: string;
  name: string;
  count: number;
};
type AppTitleProps = {
  data: AppTitleData;
};
const AppTitleWrapper = styled.div`
  height: 22px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .app-name {
    margin: 0 auto 0 0;
  }
  & > *:not(.app-name) {
    margin-left: 16px;
  }
`;

const AppTitle: FC<AppTitleProps> = ({ data }) => {
  const [host, setHost] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const handleStartReplay = () => {
    setModalVisible(true);
    console.log('start replay');
  };
  return (
    <AppTitleWrapper>
      <h1 className='app-name'>{`${data.id}_${data.name}`}</h1>
      <span>
        <Label htmlFor='case-count'>Case Count</Label>
        <span id='case-count'>{data.count}</span>
      </span>
      <Button size='small' type='primary' onClick={handleStartReplay}>
        Start replay
      </Button>
      <Modal
        title={`Start replay - ${data.id}`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
      >
        <span>
          <Label htmlFor='target-host'>Target Host</Label>
          <Input
            id='target-host'
            type='text'
            value={host}
            onChange={(e) => setHost(e.target.value)}
            style={{ width: '360px' }}
          />
        </span>
      </Modal>
    </AppTitleWrapper>
  );
};

export default AppTitle;
