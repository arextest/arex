import { css } from '@emotion/react';
import { Button, Radio, Space, Typography } from 'antd';
import { FC, useState } from 'react';
const { Text } = Typography;
interface ChooseRunTypeProps {
  name: string;
  onClickRun: (runType: string) => void;
}
const ChooseRunType: FC<ChooseRunTypeProps> = ({ onClickRun }) => {
  const [runType, setRunType] = useState('compare');

  return (
    <div
      style={{ flex: '1' }}
      css={css`
        padding: 16px 24px;
      `}
    >
      <p>Choose how to run your collection</p>

      <div
        css={css`
          padding-bottom: 20px;
        `}
      >
        <Radio.Group
          value={runType}
          onChange={(e) => {
            setRunType(e.target.value);
          }}
        >
          <Space direction='vertical'>
            <Radio
              value={'compare'}
              css={css`
                display: block;
              `}
            >
              <Space
                size={0}
                direction={'vertical'}
                css={css`
                  transform: translateY(-3px);
                `}
              >
                <Text>Run Compare</Text>
                <Text
                  css={css`
                    font-size: 10px;
                  `}
                  type='secondary'
                >
                  Batch run compare
                </Text>
              </Space>
            </Radio>
          </Space>
        </Radio.Group>
      </div>
      <Button
        type={'primary'}
        onClick={() => {
          onClickRun(runType);
        }}
      >
        Run
      </Button>
    </div>
  );
};

export default ChooseRunType;
