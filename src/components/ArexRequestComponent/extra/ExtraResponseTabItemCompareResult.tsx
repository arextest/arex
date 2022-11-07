import { Radio, Table, Tabs } from 'antd';
import JSONEditor from 'jsoneditor';
import _ from 'lodash-es';
import { useContext, useEffect, useRef, useState } from 'react';

import request from '../../../helpers/api/axios';
import { GlobalContext } from '../lib';
// import ReactDiffViewer from 'react-diff-viewer';

// import request from '../../../../../helpers/api/axios';
// import { GlobalContext, HttpContext } from '../../index';

// import request from '../../helpers/api/axios';

const onChange = (key: string) => {};

const ExtraResponseTabItemCompareResult = ({ responses }) => {
  const { store: globalStore } = useContext(GlobalContext);
  console.log(responses, 'responses');
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
      render(pathPair) {
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
      render(pathPair) {
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

  function removeNull(obj) {
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
    if (responses[0] && responses[1]) {
      const params = {
        msgCombination: {
          baseMsg: JSON.stringify(removeNull(responses[0])),
          testMsg: JSON.stringify(removeNull(responses[1])),
        },
      };
      request.post('/api/compare/quickCompare', params).then((res) => {
        setDataSource(res.body.diffDetails.map((i) => i.logs[0]));
      });

      function onClassName({ path, field, value }) {
        const leftValue = _.get(jsonRight, path);
        const rightValue = _.get(jsonLeft, path);

        return _.isEqual(leftValue, rightValue) ? 'the_same_element' : 'different_element';
      }

      const optionsLeft = {
        mode: 'tree',
        onClassName: onClassName,
        onChangeJSON: function (j) {
          jsonLeft = j;
          window.editorRight.refresh();
        },
      };

      const optionsRight = {
        mode: 'tree',
        onClassName: onClassName,
        onChangeJSON: function (j) {
          jsonRight = j;
          window.editorLeft.refresh();
        },
      };

      let jsonLeft = JSON.parse(JSON.stringify(responses[0]));

      let jsonRight = JSON.parse(JSON.stringify(responses[1]));

      window.editorLeft = new JSONEditor(containerLeftRef.current, optionsLeft, jsonLeft);
      window.editorRight = new JSONEditor(containerRightRef.current, optionsRight, jsonRight);
    }
  }, [responses]);

  return (
    <Tabs
      style={{ height: '100%' }}
      defaultActiveKey='compareResult'
      items={[
        {
          key: 'compareResult',
          label: 'Compare Result',
          children: (
            <>
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
                <div id='MsgWithDiffJsonEditorWrapper' style={{ height: '90vh' }}>
                  <div ref={containerLeftRef} id='containerLeft' />
                  <div ref={containerRightRef} id='containerRight' />
                </div>
              </div>
              <div style={{ display: activeRadio === 'table' ? 'block' : 'none' }}>
                <Table dataSource={dataSource} columns={columns} />
              </div>
            </>
          ),
        },
      ]}
      onChange={onChange}
    />
  );
};

export default ExtraResponseTabItemCompareResult;
