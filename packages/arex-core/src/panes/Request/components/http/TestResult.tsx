import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { List, Progress, Tag, Typography } from 'antd';
import { FC } from 'react';

import { HoppTestResult } from '../../helpers/types/HoppTestResult';
const { Text, Link } = Typography;

const gonggong = css`
  padding: 10px;
  padding-bottom: 0;
`;
const TestResult: FC<{ testResult: any }> = ({ testResult }) => {
  return (
    <div>
      {testResult.map((t: any, index: number) => {
        if (t.passed) {
          return (
            <div css={gonggong} key={index}>
              <Tag color={'success'}>成功</Tag>
              <Text type='secondary'>{t.name}</Text>
              {/*<Text*/}
            </div>
          );
        } else {
          return (
            <div css={gonggong} key={index}>
              <Tag color={'error'}>失败</Tag>
              <Text type='secondary'>
                {t.name} | AssertionError: {t.error.message}
              </Text>
              {/*<Text*/}
            </div>
          );
        }
      })}
    </div>
  );
};

export default TestResult;
