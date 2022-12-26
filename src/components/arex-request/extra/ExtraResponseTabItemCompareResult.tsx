import { css } from '@emotion/react';
import { Radio, Spin, Table, Tabs } from 'antd';
import JSONEditor from 'jsoneditor';
import _ from 'lodash-es';
import { FC, useContext, useEffect, useRef, useState } from 'react';

import axios from '../../../helpers/api/axios';
import { HttpContext } from '../index';
// import { const } from 'fp-ts';

const ExtraResponseTabItemCompareResult: FC<{ responses: any[]; theme: string }> = ({
  responses,
  theme,
}) => {
  const diffView = useRef<HTMLDivElement>();
  useEffect(() => {
    if (!diffView.current) {
      return;
    }
  }, [responses]);

  const columns = [
    {
      title: 'Left Path',
      dataIndex: 'pathPair',
      key: 'pathPair',
      render(pathPair: any) {
        const leftArr = [];
        for (let i = 0; i < pathPair.leftUnmatchedPath.length; i++) {
          leftArr.push(
            pathPair.leftUnmatchedPath[i].nodeName
              ? pathPair.leftUnmatchedPath[i].nodeName
              : pathPair.leftUnmatchedPath[i].index,
          );
        }
        return <div>{leftArr.join('.')}</div>;
      },
    },
    {
      title: 'Right Path',
      dataIndex: 'pathPair',
      key: 'pathPair',
      render(pathPair: any) {
        const rightArr = [];
        for (let i = 0; i < pathPair.rightUnmatchedPath.length; i++) {
          rightArr.push(
            pathPair.rightUnmatchedPath[i].nodeName
              ? pathPair.rightUnmatchedPath[i].nodeName
              : pathPair.rightUnmatchedPath[i].index,
          );
        }
        return <div>{rightArr.join('.')}</div>;
      },
    },
    {
      title: 'Left Value',
      dataIndex: 'baseValue',
      key: 'baseValue',
    },
    {
      title: 'Right Value',
      dataIndex: 'testValue',
      key: 'testValue',
    },
    {
      title: 'Difference',
      dataIndex: 'logInfo',
      key: 'logInfo',
    },
  ];

  const [activeRadio, setActiveRadio] = useState<string>('json');
  const [dataSource, setDataSource] = useState<any>([]);
  const optionsWithDisabled = [
    { label: 'JSON', value: 'json' },
    { label: 'Table', value: 'table' },
  ];

  function removeNull(obj: any) {
    for (const key in obj) {
      if (obj[key] === null) {
        obj[key] = '';
      }
      if (typeof obj[key] == 'object') {
        removeNull(obj[key]);
      }
    }
    return obj;
  }
  const containerLeftRef = useRef<HTMLDivElement>(null);
  const containerRightRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // @ts-ignore
    containerLeftRef.current.innerHTML = '';
    // @ts-ignore
    containerRightRef.current.innerHTML = '';
    if (responses[0] && responses[1]) {
      const params = {
        msgCombination: {
          baseMsg: JSON.stringify(removeNull(responses[0])),
          testMsg: JSON.stringify(removeNull(responses[1])),
        },
      };
      axios.post('/api/compare/quickCompare', params).then((res) => {
        // @ts-ignore
        setDataSource((res.body.diffDetails || []).map((i) => i.logs[0]));
      });

      const onClassName = ({ path, field, value }: any) => {
        const leftValue = _.get(jsonRight, path);
        const rightValue = _.get(jsonLeft, path);
        return _.isEqual(leftValue, rightValue) ? 'the_same_element' : 'different_element';
      };

      const optionsLeft = {
        mode: 'tree',
        onClassName: onClassName,
        onChangeJSON: function (j: any) {
          jsonLeft = j;
          // @ts-ignore
          window.editorRight.refresh();
        },
      };

      const optionsRight = {
        mode: 'tree',
        onClassName: onClassName,
        onChangeJSON: function (j: any) {
          jsonRight = j;
          // @ts-ignore
          window.editorLeft.refresh();
        },
      };

      let jsonLeft = JSON.parse(JSON.stringify(responses[0]));

      let jsonRight = JSON.parse(JSON.stringify(responses[1]));
      // @ts-ignore
      window.editorLeft = new JSONEditor(containerLeftRef.current, optionsLeft, jsonLeft);
      // @ts-ignore
      window.editorRight = new JSONEditor(containerRightRef.current, optionsRight, jsonRight);
    }
  }, [responses]);
  const { store } = useContext(HttpContext);
  return (
    <div
      css={css`
        height: 100%;
        //相当于最小高度
        padding: 0 16px;
        .ant-tabs-content-holder {
          height: 100px;
        }
      `}
    >
      <Spin
        wrapperClassName={'ExtraResponseTabItemCompareResult-wrapperClassName'}
        spinning={store.compareLoading}
      >
        <Tabs
          css={css`
            height: 100%;
          `}
          defaultActiveKey='compareResult'
          items={[
            {
              key: 'compareResult',
              label: 'Compare Result',
              children: (
                <div>
                  <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                    <Radio.Group
                      size={'small'}
                      options={optionsWithDisabled}
                      onChange={(val) => {
                        setActiveRadio(val.target.value);
                      }}
                      value={activeRadio}
                      optionType='button'
                      buttonStyle='solid'
                    />
                  </div>

                  <div
                    className='react-diff-code-view'
                    style={{ height: '100%', display: activeRadio === 'json' ? 'block' : 'none' }}
                  >
                    <div
                      id='MsgWithDiffJsonEditorWrapper'
                      className={theme === 'dark' ? 'dark-jsoneditor' : ''}
                      css={css`
                        overflow: hidden;
                      `}
                    >
                      <div ref={containerLeftRef} id='containerLeft' />
                      <div ref={containerRightRef} id='containerRight' />
                    </div>
                  </div>
                  <div style={{ display: activeRadio === 'table' ? 'block' : 'none' }}>
                    <Table dataSource={dataSource} columns={columns} />
                  </div>
                </div>
              ),
            },
          ]}
        />
      </Spin>
    </div>
  );
};

export default ExtraResponseTabItemCompareResult;
