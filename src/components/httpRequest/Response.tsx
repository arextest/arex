import { javascript } from '@codemirror/lang-javascript';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import CodeMirror from '@uiw/react-codemirror';
import { Tabs, List, Progress } from 'antd';
import { FC, useEffect, useMemo } from 'react';

import { useStore } from '../../store';
import { color } from '../../utils/chart';
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

const Response: FC<{
  res: any;
  status: { code: number; text: string };
  time?: number;
  size?: number;
  responseHeaders?: object;
  TestResult?: [];
}> = (props) => {
  const onChange = (key: string) => {
    console.log(key);
  };

  const theme = useStore((state) => state.theme);
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

  useEffect(() => {
    console.log(props.TestResult);
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
          Size：<span>{props.size || 0} KB</span>
        </div>
      </StatusWrapper>
      <Tabs defaultActiveKey='1' onChange={onChange}>
        <TabPane tab='Pretty' key='1'>
          <CodeMirror
            value={JSON.stringify(props.res, null, 2)}
            extensions={[javascript()]}
            width='100%'
            height='500px'
            theme={theme}
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
        <TabPane tab='Test Results' key='4'>
          {props.TestResult?.map((e: any, i) => (
            <List
              size='large'
              style={{ marginBottom: '20px' }}
              header={
                <div>
                  <div style={{ marginTop: '-10px', fontWeight: 'bold' }}>{e.descriptor}</div>
                  <div style={{ marginTop: '10px' }}>
                    <Progress
                      strokeColor={'#EF4444'}
                      width={20}
                      strokeWidth={20}
                      percent={64}
                      success={{ percent: 41, strokeColor: '#10B981' }}
                      type='circle'
                      showInfo={false}
                    />
                    <span style={{ marginLeft: '10px' }}>
                      failing,{e.expectResults.length} successful,out of {e.expectResults.length}{' '}
                      tests
                    </span>
                  </div>
                </div>
              }
              bordered
              dataSource={e.expectResults}
              renderItem={(item: any, i) => (
                <List.Item key={i}>
                  {item.status == 'pass' ? (
                    <CheckOutlined style={{ color: '#10B981', marginRight: '15px' }} />
                  ) : (
                    <CloseOutlined style={{ color: '#EF4444', marginRight: '15px' }} />
                  )}
                  {item.message}——{item.status == 'pass' ? '测试成功' : '测试失败'}
                </List.Item>
              )}
            />
          ))}
        </TabPane>
      </Tabs>
    </>
  );
};

export default Response;
