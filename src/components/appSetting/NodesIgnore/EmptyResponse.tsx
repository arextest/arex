import { Button, Empty } from 'antd';
import React, { FC } from 'react';

import { FlexCenterWrapper } from '../../styledComponents';

type EmptyResponseProps = {
  onClick?: () => void;
};

const EmptyResponse: FC<EmptyResponseProps> = (props) => {
  return (
    <FlexCenterWrapper style={{ padding: '24px' }}>
      <Empty
        description={'Empty Response'}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{ paddingBottom: '16px' }}
      />

      <Button size='small' type='primary' onClick={() => props.onClick?.()}>
        Config Response
      </Button>
    </FlexCenterWrapper>
  );
};

export default EmptyResponse;
