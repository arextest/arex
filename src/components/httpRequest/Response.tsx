import { javascript } from '@codemirror/lang-javascript';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import CodeMirror from '@uiw/react-codemirror';
import { Badge, List, Progress, Tabs } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useStore } from '../../store';
import FormTable, { getColumns } from './FormTable';
const { TabPane } = Tabs;
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const StatusWrapper = styled.div`
  div {
    margin-right: 16px;
    display: inline-block;
  }
  span {
    color: #10b981;
  }
`;

const TestError = styled.div`
  text-align: center;
  & > div:first-of-type {
    color: ${(props) => props.theme.color.text.secondary};
  }
  & > div:nth-of-type(2) {
    color: ${(props) => props.theme.color.text.secondary};
    margin-top: 10px;
  }
`;

const Response: FC<{
  res: any;
  status: { code: number; text: string };
  time?: number;
  size?: number;
  responseHeaders?: object;
  TestResult?: [];
  isTestResult: boolean;
}> = (props) => {
  const onChange = (key: string) => {
    console.log(key);
  };
  const { t: t_components } = useTranslation('components');
  const { themeClassify } = useStore();
  const headers = useMemo(
    () =>
      props.responseHeaders
        ? Object.entries(props.responseHeaders).map((h) => ({
            key: h[0],
            value: h[1],
          }))
        : [],
    [props.responseHeaders],
  );

  useEffect(() => {
    console.log(headers);
  }, [headers]);

  const [testPass, setTestPass] = useState<number[]>([]);
  useEffect(() => {
    const arrPass: number[] = [];
    props.TestResult &&
      props.TestResult.map((e: any) => {
        arrPass.push(e.expectResults.filter((a: any) => a.status == 'pass').length);
      });
    setTestPass(arrPass);
  }, [props.TestResult]);
  return (
    <>
      <StatusWrapper>
        <div
          css={css`
            color: #ff51ab;
          `}
        >
          Status：
          <span>
            {props.status.code} {props.status.text}
          </span>
        </div>
        <div>
          Time：<span>{props.time || 0} ms</span>
        </div>
        <div>
          Size：<span>{props.size || 0} </span>
        </div>
      </StatusWrapper>
      <Tabs defaultActiveKey='1' onChange={onChange}>
        <TabPane tab='Pretty' key='1'>
          <CodeMirror
            value={JSON.stringify(props.res, null, 2)}
            extensions={[javascript()]}
            width='100%'
            height='500px'
            theme={themeClassify}
          />
        </TabPane>
        <TabPane tab='Raw' key='2'>
          <span style={{ wordBreak: 'break-all' }}>{JSON.stringify(props.res)}</span>
        </TabPane>
        <TabPane tab='Header' key='3'>
          <FormTable
            bordered
            showHeader
            size='small'
            rowKey='id'
            pagination={false}
            dataSource={headers}
            // @ts-ignore
            columns={getColumns()}
          />
        </TabPane>
        <TabPane
          tab={
            props.TestResult && props.TestResult.length ? (
              <Badge dot={true} offset={[-1, 11]} color='#10B981'>
                <div
                  css={css`
                    padding-right: 10px;
                  `}
                >
                  Test Results
                </div>
              </Badge>
            ) : (
              'Test Results'
            )
          }
          key='4'
        >
          {props.isTestResult ? (
            props.TestResult?.map((e: any, i) => (
              <List
                key={i}
                size='large'
                css={css`
                  margin-bottom: 10px;
                `}
                header={
                  <div>
                    <div
                      css={css`
                        margin-top: -10px;
                        font-weight: bold;
                      `}
                    >
                      {e.descriptor}
                    </div>
                    <div
                      css={css`
                        margin-top: 10px;
                      `}
                    >
                      <Progress
                        strokeColor={'#EF4444'}
                        width={20}
                        strokeWidth={20}
                        percent={100}
                        success={{
                          percent: Math.round((testPass[i] / e.expectResults.length) * 100),
                          strokeColor: '#10B981',
                        }}
                        type='circle'
                        showInfo={false}
                      />
                      <span
                        css={css`
                          margin-left: 10px;
                        `}
                      >
                        {e.expectResults.length - testPass[i] ? (
                          <span
                            css={css`
                              color: #ef4444;
                            `}
                          >
                            {e.expectResults.length - testPass[i]} failing,{' '}
                          </span>
                        ) : (
                          <></>
                        )}
                        {testPass[i] ? (
                          <span
                            css={css`
                              color: #10b981;
                            `}
                          >
                            {testPass[i]} successful,{' '}
                          </span>
                        ) : (
                          <></>
                        )}
                        out of {e.expectResults.length} tests
                      </span>
                    </div>
                  </div>
                }
                bordered
                dataSource={e.expectResults}
                renderItem={(item: any, i) => (
                  <List.Item key={i}>
                    {item.status == 'pass' ? (
                      <CheckOutlined
                        css={css`
                          color: #10b981;
                          margin-right: 15px;
                        `}
                      />
                    ) : (
                      <CloseOutlined
                        css={css`
                          color: #ef4444;
                          margin-right: 15px;
                        `}
                      />
                    )}
                    {item.message}——
                    {item.status == 'pass'
                      ? t_components('http.testPassed')
                      : t_components('http.testFailed')}
                  </List.Item>
                )}
              />
            ))
          ) : (
            <TestError>
              <img src={'https://hoppscotch.io/images/states/light/youre_lost.svg'}></img>
              <div>Could not execute post-request script</div>
              <div>
                There seems to be an error with test script. Please fix the errors and run tests
                again
              </div>
              {/* <div>无法执行请求脚本</div>
              <div>测试脚本似乎有一个错误，请修复错误并再次运行测试</div> */}
            </TestError>
          )}
        </TabPane>
      </Tabs>
    </>
  );
};

export default Response;
