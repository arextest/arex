import { CloseOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { useMount, useUnmount } from 'ahooks';
import { Alert } from 'antd';
import JSONEditor from 'jsoneditor';
import { useEffect, useRef } from 'react';

const DiffJsonView = ({ data, visible = false, onClose }) => {
  useMount(() => {
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        onClose();
      }
    });
  });

  const containerLeftRef = useRef();
  const containerRightRef = useRef();

  const msgWithDiff = data;

  console.log(msgWithDiff, 'msgWithDiff');

  // TODO 使用工具函数 utils/tryParseJsonString
  function strConvertToJson(str: string) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return {
        content: str,
      };
    }
  }

  useEffect(() => {
    const containerLeft = containerLeftRef.current;
    const containerRight = containerRightRef.current;
    if (msgWithDiff && containerLeft && containerRight) {
      setTimeout(() => {
        containerLeft.innerHTML = '';
        containerRight.innerHTML = '';
        function genAllDiffByType(logs) {
          const allDiff = {
            diff012: [],
            diff3: [],
            diff012Ig: [],
            diff3Ig: [],
          };
          for (let j = 0; j < logs.length; j++) {
            const leftArr = [];
            for (let i = 0; i < logs[j].pathPair.leftUnmatchedPath.length; i++) {
              leftArr.push(
                logs[j].pathPair.leftUnmatchedPath[i].nodeName
                  ? logs[j].pathPair.leftUnmatchedPath[i].nodeName
                  : logs[j].pathPair.leftUnmatchedPath[i].index,
              );
            }
            const rightArr = [];
            for (let i = 0; i < logs[j].pathPair.rightUnmatchedPath.length; i++) {
              rightArr.push(
                logs[j].pathPair.rightUnmatchedPath[i].nodeName
                  ? logs[j].pathPair.rightUnmatchedPath[i].nodeName
                  : logs[j].pathPair.rightUnmatchedPath[i].index,
              );
            }
            const unmatchedTypes = [0, 1, 2];
            if (logs[j].logTag.ig) {
              if (unmatchedTypes.includes(logs[j].pathPair.unmatchedType)) {
                allDiff.diff012Ig.push(leftArr.length > rightArr.length ? leftArr : rightArr);
              } else {
                allDiff.diff3Ig.push(leftArr);
                allDiff.diff3Ig.push(rightArr);
              }
            } else {
              if (unmatchedTypes.includes(logs[j].pathPair.unmatchedType)) {
                allDiff.diff012.push(leftArr.length > rightArr.length ? leftArr : rightArr);
              } else {
                allDiff.diff3.push(leftArr);
                allDiff.diff3.push(rightArr);
              }
            }
          }
          return allDiff;
        }
        const allDiffByType = genAllDiffByType(msgWithDiff.logs);
        function onClassName({ path }) {
          // 只能返回一种ClassName
          if (
            allDiffByType.diff012.map((item) => JSON.stringify(item)).includes(JSON.stringify(path))
          ) {
            return 'different_element_012';
          }
          if (
            allDiffByType.diff3.map((item) => JSON.stringify(item)).includes(JSON.stringify(path))
          ) {
            return 'different_element';
          }
        }
        const optionsLeft = {
          mode: 'view',
          theme: 'twitlighjt',
          onClassName: onClassName,
          onChangeJSON: function (j) {
            jsonLeft = j;
            window.editorRight.refresh();
          },
        };
        const optionsRight = {
          mode: 'view',
          onClassName: onClassName,
          onChangeJSON: function (j) {
            jsonRight = j;
            window.editorLeft.refresh();
          },
        };
        let jsonLeft = strConvertToJson(msgWithDiff?.baseMsg);
        let jsonRight = strConvertToJson(msgWithDiff?.testMsg);
        window.editorLeft = new JSONEditor(containerLeft, optionsLeft, jsonLeft);
        window.editorRight = new JSONEditor(containerRight, optionsRight, jsonRight);
        window.editorLeft.expandAll();
        window.editorRight.expandAll();
      }, 200);
    }
  }, [msgWithDiff]);

  return (
    <div
      css={css`
        position: fixed;
        display: ${visible ? 'block' : 'none'};
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: white;
        z-index: 1000;
      `}
    >
      <div
        css={css`
          margin: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        `}
      >
        <span>Press &quot;esc&quot; to exit</span>
        <CloseOutlined onClick={() => onClose()}>关闭</CloseOutlined>
      </div>

      <div
        css={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        <div className='MsgWithDiffLegend'>
          <div>
            <div className='color-tag-green'></div>
            <span>One more node than</span>
          </div>
          <div>
            <div className='color-tag-pink'></div>
            <span>Difference node</span>
          </div>
          <div>
            <div className='color-tag-grey'></div>
            <span>Ignore node</span>
          </div>
        </div>
      </div>

      <div id='MsgWithDiffJsonEditorWrapper' style={{ height: '90vh' }}>
        <div ref={containerLeftRef} id='containerLeft'></div>
        <div ref={containerRightRef} id='containerRight'></div>
      </div>
    </div>
  );
};

export default DiffJsonView;
