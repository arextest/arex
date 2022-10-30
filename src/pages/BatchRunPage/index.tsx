import { FolderOutlined, RightOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Button, Checkbox, Col, Form, Input, message, Row, Space, Tabs, Tree } from 'antd';
import { Divider } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React, { useMemo, useState } from 'react';

// import AgentAxios from '../../components/ArexRequestComponent/lib/helpers/request';
// import { runTestScript } from '../../components/ArexRequestComponent/lib/helpers/sandbox';
import { treeFindPath } from '../../helpers/collection/util';
import { AgentAxiosAndTest } from '../../helpers/request';
import { FileSystemService } from '../../services/FileSystem.service';
import { useStore } from '../../store';
import RunResult from './RunResult';

/**
 * 树转数组扁平化结构
 * 深度优先遍历  递归
 */
function deepTraversal(data) {
  const cloneData = JSON.parse(JSON.stringify(data));
  const result = [];
  data.forEach((item) => {
    const loop = (data) => {
      result.push({
        id: data.id,
        key: data.key,
        title: data.title,
        method: data.method,
        nodeType: data.nodeType,
        path: treeFindPath(cloneData, (node) => node.id === data.id),
      });
      const child = data.children;
      if (child) {
        for (let i = 0; i < child.length; i++) {
          loop(child[i]);
        }
      }
    };
    loop(item);
  });
  return result;
}

async function assemblyData(runCases) {
  const caseResArr = await Promise.all(
    runCases.map((i) => {
      return FileSystemService.queryCase({ id: i }).then((r) => r.body);
    }),
  );

  const arr = [];

  for (let i = 0; i < caseResArr.length; i++) {
    const sss = await AgentAxiosAndTest({
      request: {
        endpoint: caseResArr[i].address.endpoint,
        method: caseResArr[i].address.method,
        testScript: caseResArr[i].testScript,
        params: caseResArr[i].params,
        headers: caseResArr[i].headers,
        body: caseResArr[i].body,
      },
    });

    arr.push({
      endpoint: caseResArr[i].address.endpoint,
      method: caseResArr[i].address.method,
      title: caseResArr[i].address.endpoint,
      testResult: sss.testResult,
    });
  }

  // for (let i = 0; i < caseResArr.length; i++) {
  //   // await
  //   const r0 = caseResArr[i];
  //
  //   const sss = await AgentAxios({
  //     method: r0.address.method,
  //     url: r0.address.endpoint,
  //     headers: r0.headers.reduce((p, c) => {
  //       return {
  //         ...p,
  //         [c.key]: c.value,
  //       };
  //     }, {}),
  //     data: ['GET'].includes(r0.address.method) ? undefined : JSON.parse(r0.body.body),
  //     params: ['POST'].includes(r0.address.method)
  //       ? undefined
  //       : r0.params.reduce((p, c) => {
  //           return {
  //             ...p,
  //             [c.key]: c.value,
  //           };
  //         }, {}),
  //   }).then((res: any) => {
  //     return runTestScript(r0.testScript, { body: res.data, headers: [], status: 200 }).then(
  //       (r) => {
  //         // console.log(r);
  //
  //         return {
  //           endpoint: caseResArr[i].address.endpoint,
  //           method: caseResArr[i].address.method,
  //           title: caseResArr[i].address.endpoint,
  //           testResult: r,
  //         };
  //       },
  //     );
  //   });
  //   // console.log(sss);
  //   arr.push(sss)
  // }

  console.log(arr, 'arr');

  return arr;

  // const r0 = r[0];

  // return r;
}

const CaseItem = ({ data }) => {
  return (
    <div>
      {data.path.map((i) => (
        <>
          <FolderOutlined />
          <RightOutlined style={{ fontSize: '10px' }} />
        </>
      ))}
      <span>{data.method}</span>
      <span>{data.title}</span>
      {/*<span>{data.method}</span>*/}
    </div>
  );
};

const BatchRunPage: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = () => {
    assemblyData(checkValue).then((res) => {
      setResults(res);
    });
  };

  const onFinishFailed = () => {
    message.error('Submit failed!');
  };

  const onFill = () => {
    form.setFieldsValue({
      url: 'https://taobao.com/',
    });
  };

  const [checkValue, setCheckValue] = useState([]);
  const { collectionTreeData } = useStore();
  console.log(deepTraversal(collectionTreeData), 'collectionTreeData');

  const jiheOptions = useMemo(() => {
    return deepTraversal(collectionTreeData);
  }, [collectionTreeData]);

  // const results = [{}];

  const [results, setResults] = useState([]);

  const onChange = (checkedValues: CheckboxValueType[]) => {
    setCheckValue(checkedValues);
  };

  const plainOptions = [
    {
      label: <CaseItem></CaseItem>,
      value: 'Apple',
    },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' },
  ];
  const options = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' },
  ];
  const optionsWithDisabled = [
    {
      label: (
        <div
          css={css`
            color: rebeccapurple;
          `}
        >
          sfawsf
        </div>
      ),
      value: 'Apple',
    },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange', disabled: false },
  ];

  return (
    <div>
      <Row gutter={16} style={{ padding: '20px' }}>
        <Col className='gutter-row' span={11}>
          <p
            css={css`
              font-weight: bolder;
            `}
          >
            Select need test case
          </p>
          <div
            css={css`
              .ant-checkbox-group {
                display: flex;
                flex-direction: column;
                max-height: 300px;
                //height: 300px;
                overflow-y: auto;
              }
            `}
          >
            <Checkbox.Group
              options={jiheOptions
                .filter((i) => i.nodeType === 2)
                .map((i) => {
                  return { label: <CaseItem data={i}></CaseItem>, value: i.key };
                })}
              value={checkValue}
              onChange={onChange}
            />
          </div>
        </Col>
        <Col span={2}>
          <Divider style={{ height: '100%' }} type={'vertical'} />
        </Col>
        <Col className='gutter-row' span={11}>
          <div>
            <Form
              form={form}
              layout='vertical'
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete='off'
            >
              <Form.Item name='url' label=''>
                <Checkbox>Start Arex replay compare</Checkbox>
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type='primary' htmlType='submit'>
                    Run Case
                  </Button>
                </Space>
              </Form.Item>
            </Form>

            {/*<Button onClick={()=>{*/}
            {/*  console.log(checkValue,'c')*/}
            {/*}}>Run Case</Button>*/}
          </div>
        </Col>
      </Row>
      <Divider></Divider>
      <div
        css={css`
          padding: 20px;
        `}
      >
        <Tabs
          items={[
            {
              label: 'Test',
              key: 'test',
              children: <RunResult results={results} />,
            },
            {
              label: 'Compare',
              key: 'compare',
            },
          ]}
        />
      </div>
    </div>
  );
};

export default BatchRunPage;
