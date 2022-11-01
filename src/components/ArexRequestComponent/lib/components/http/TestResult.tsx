import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { List, Progress } from 'antd';
import { useContext, useRef, useState } from 'react';

import { useCodeMirror } from '../../helpers/editor/codemirror';
import { getValueByPath } from '../../helpers/utils/locale';
import { GlobalContext, HttpContext } from '../../index';
const TestError = styled.div`
  text-align: center;
  & > div:first-of-type {
  }
  & > div:nth-of-type(2) {
    margin-top: 10px;
  }
`;
const TestResult = ({ testResult }) => {
  const { store } = useContext(GlobalContext);
  console.log(store, 'store');
  return (
    <div>
      {true ? (
        testResult.children?.map((e: any, i) => (
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
                      percent: Math.round(
                        (e.expectResults.filter((i) => i.status === 'pass').length /
                          e.expectResults.length) *
                          100,
                      ),
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
                    {e.expectResults.length -
                    e.expectResults.filter((i) => i.status === 'pass').length ? (
                      <span
                        css={css`
                          color: #ef4444;
                        `}
                      >
                        {e.expectResults.length -
                          e.expectResults.filter((i) => i.status === 'pass').length}{' '}
                        failing,{' '}
                      </span>
                    ) : (
                      <></>
                    )}
                    {e.expectResults.filter((i) => i.status === 'pass').length ? (
                      <span
                        css={css`
                          color: #10b981;
                        `}
                      >
                        {e.expectResults.filter((i) => i.status === 'pass').length} successful,{' '}
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
                {item.status == 'pass' ? 'testPassed' : 'testFailed'}
              </List.Item>
            )}
          />
        ))
      ) : (
        <TestError>
          <img src={'https://hoppscotch.io/images/states/light/youre_lost.svg'}></img>
          <div>Could not execute post-request script</div>
          <div>
            There seems to be an error with test script. Please fix the errors and run tests again
          </div>
          {/* <div>无法执行请求脚本</div>
              <div>测试脚本似乎有一个错误，请修复错误并再次运行测试</div> */}
        </TestError>
      )}
    </div>
  );
};

export default TestResult;
