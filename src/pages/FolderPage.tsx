import { Select, Tabs, Typography } from 'antd';
import { FC } from 'react';

const { Text } = Typography;

const FolderPage: FC = () => {
  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div>
      <Tabs
        defaultActiveKey='authorization'
        items={[
          {
            key: 'authorization',
            label: 'Authorization',
            children: (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <Text>
                    This authorization method will be used for every request in this folder. You can
                    override this by specifying one in the request.
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
                    The authorization header will be automatically generated when you send the
                    request.
                  </Text>
                </div>
              </>
            ),
          },
          {
            key: 'pre-requestScript',
            label: 'Pre-request Script',
            children: 'Content of Pre-request Script',
            disabled: true,
          },
          {
            key: 'tests',
            label: 'Tests',
            children: 'Content of Tests',
            disabled: true,
          },
        ]}
        onChange={onChange}
      />
    </div>
  );
};

export default FolderPage;
