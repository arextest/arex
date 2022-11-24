import { Select, Typography } from 'antd';
import { FC } from 'react';

const { Text } = Typography;

const Authorization: FC = () => {
  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <Text>
          This authorization method will be used for every request in this folder. You can override
          this by specifying one in the request.
        </Text>
      </div>
      <div style={{ padding: '10px' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ width: '200px', display: 'inline-block' }}>
            <Text strong>Type</Text>
          </div>
          <Select
            style={{ width: '200px' }}
            options={[
              {
                value: 'parent',
                label: 'Inherit auth from parent',
              },
            ]}
            disabled
            value={'parent'}
          />
        </div>
        <Text type='secondary'>
          The authorization header will be automatically generated when you send the request.
        </Text>
      </div>
    </>
  );
};

export default Authorization;
