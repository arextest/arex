import styled from '@emotion/styled';
import { Button } from 'antd';
import React, { FC } from 'react';

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
  const handleStartReplay = () => {
    console.log('start replay');
  };
  return (
    <AppTitleWrapper>
      <h1 className='app-name'>{`${data.id}_${data.name}`}</h1>
      <span>
        <label>Case Count: </label>
        <span>{data.count}</span>
      </span>
      <Button size='small' type='primary' onClick={handleStartReplay}>
        Start replay
      </Button>
    </AppTitleWrapper>
  );
};

export default AppTitle;
