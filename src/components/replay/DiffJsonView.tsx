import { css } from '@emotion/react';
import { useMount } from 'ahooks';
import { Modal } from 'antd';
import JSONEditor, { JSONEditorOptions } from 'jsoneditor';
import { FC, useEffect, useRef } from 'react';

import { tryParseJsonString } from '../../helpers/utils';
import { QueryMsgWithDiffLog } from '../../services/Replay.type';

export type DiffJsonViewProps = {
  data?: {
    baseMsg: string;
    testMsg: string;
    logs: QueryMsgWithDiffLog[];
  };
  open: boolean;
  onClose: () => void;
};
const DiffJsonView: FC<DiffJsonViewProps> = ({ data, open = false, onClose }) => {
  useMount(() => {
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        onClose();
      }
    });
  });

  const containerLeftRef = useRef<HTMLDivElement>(null);
  const containerRightRef = useRef<HTMLDivElement>(null);

  const msgWithDiff = data;

  useEffect(() => {
    const containerLeft = containerLeftRef.current;
    const containerRight = containerRightRef.current;
    if (msgWithDiff && containerLeft && containerRight) {
      setTimeout(() => {
        containerLeft.innerHTML = '';
        containerRight.innerHTML = '';
        function genAllDiffByType(logs: QueryMsgWithDiffLog[]) {
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
        const optionsLeft: JSONEditorOptions = {
          mode: 'view',
          theme: 'twitlighjt',
          onClassName: onClassName,
          onChangeJSON: function (j) {
            jsonLeft = j;
            window.editorRight.refresh();
          },
        };
        const optionsRight: JSONEditorOptions = {
          mode: 'view',
          onClassName: onClassName,
          onChangeJSON: function (j) {
            jsonRight = j;
            window.editorLeft.refresh();
          },
        };

        let jsonLeft = tryParseJsonString(msgWithDiff?.baseMsg);
        let jsonRight = tryParseJsonString(msgWithDiff?.testMsg);
        // TODO 将 JSONEditor 挂载到 window 上是否必要
        window.editorLeft = new JSONEditor(containerLeft, optionsLeft, jsonLeft);
        window.editorRight = new JSONEditor(containerRight, optionsRight, jsonRight);
        window.editorLeft.expandAll();
        window.editorRight.expandAll();
      }, 20);
    }
  }, [msgWithDiff]);

  return (
    <Modal
      title='Press Esc to exit'
      width={'100%'}
      open={open}
      onCancel={onClose}
      style={{ top: 0 }}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        <div className='MsgWithDiffLegend'>
          <div>
            <div className='color-tag-green' />
            <span>One more node than</span>
          </div>
          <div>
            <div className='color-tag-pink' />
            <span>Difference node</span>
          </div>
          <div>
            <div className='color-tag-grey' />
            <span>Ignore node</span>
          </div>
        </div>
      </div>

      <div id='MsgWithDiffJsonEditorWrapper' style={{ height: '90vh' }}>
        <div ref={containerLeftRef} id='containerLeft' />
        <div ref={containerRightRef} id='containerRight' />
      </div>
    </Modal>
  );
};

export default DiffJsonView;
