import { css, useTheme } from '@emotion/react';
import * as monaco from 'monaco-editor';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';

import { useMonaco } from '../../../../../composables/monaco';
import {
  getMarkFromToArr,
  HOPP_ENVIRONMENT_REGEX,
} from '../../../editor/extensions/HoppEnvironment';
import { HttpContext } from '../../../index';
import SmartTooltip from '../Tooltip';
import TooltipContent from './TooltipContent';
import { getElementViewPosition } from './util';

interface SmartEnvInputProps {
  value: string;
  onChange: (e: any) => void;
}
const SmartEnvInput: FC<SmartEnvInputProps> = ({ value, onChange }) => {
  const theme = useTheme();
  // TODO editor type
  const { store } = useContext(HttpContext);
  const [open, setOpen] = useState(false);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [textContent, setTextContent] = useState('');
  const smartEnvInputRef = useRef<HTMLDivElement>(null);

  const editorRef = useRef(null);

  function mouseoverFn(e: any) {
    const { x, y } = getElementViewPosition(e.target);
    const l = x;
    const t = y;
    setLeft(l);
    setTop(t);
    setOpen(true);
    setTextContent(e.target.textContent);
  }
  function mouseoutFn() {
    setOpen(false);
  }
  const { editor } = useMonaco(editorRef, value, {
    extendedEditorConfig: {
      lineWrapping: true,
      placeholder: '',
      theme: store.theme,
      isEndpointInput: true,
    },
    environmentHighlights: true,
    onChange: (val: string) => {
      onChange(val);
      decorations(val, editor);
    },
  });
  useEffect(() => {
    // console.log(editor,'editor')
    if (editor) {
      decorations(value, editor);
    }
  }, [editor]);
  // ============================== 鼠标mouseenter时，为所有mark添加mouse事件 ==============================
  useEffect(() => {
    if (smartEnvInputRef.current) {
      smartEnvInputRef.current.addEventListener('mouseenter', (e) => {
        const foundDomList: any = document.querySelectorAll('.content-class-found');
        const noFoundDomList: any = document.querySelectorAll('.content-class-no-found');
        const allDomList = [...foundDomList, ...noFoundDomList];
        for (const key in allDomList) {
          allDomList[key].addEventListener('mouseover', mouseoverFn);
          allDomList[key].addEventListener('mouseout', mouseoutFn);
        }
      });
    }
    if (editorRef.current) {
      decorations(value, editor);
    }
  }, [store.environment]);

  // ============================== decorations - {{env}}高亮 ==============================
  function decorations(value: any, editor: any) {
    const marks = getMarkFromToArr(value, HOPP_ENVIRONMENT_REGEX, store.environment);
    const ids = [];
    const decorations = editor?.getModel().getAllDecorations() || [];
    // ============================== 删除上次mark start ==============================
    for (const decoration of decorations) {
      if (
        decoration &&
        decoration.options &&
        (decoration.options.inlineClassName === 'content-class-no-found' ||
          decoration.options.inlineClassName === 'content-class-found')
      ) {
        ids.push(decoration.id);
      }
    }

    if (ids && ids.length) {
      editor?.deltaDecorations(ids, []);
    }
    // ============================== 删除上次mark end ==============================
    const rs = marks.map((m) => {
      const { found, from, to } = m;
      return {
        range: new monaco.Range(1, from + 1, 1, to + 1), // rowStart, columnStart, rowEnd, columnEnd
        options: {
          isWholeLine: false,
          // className: content-class-no-found, // 代码行样式类名
          // glyphMarginClassName: content-class-no-found, // 行数前面小块标记样式类名
          inlineClassName: found ? 'content-class-found' : 'content-class-no-found',
        },
      };
    });

    editor?.deltaDecorations(
      [], // oldDecorations 每次清空上次标记的
      rs,
    );
  }

  return (
    <div
      ref={smartEnvInputRef}
      css={css`
        border: 1px solid ${theme.colorBorder};
        flex: 1;
        //添加 min-width: 0 的原因: https://juejin.cn/post/6974356682574921765
        min-width: 0;
        display: flex;
        align-items: center;
        //overflow-y: hidden;
        .content-class-no-found {
          background: #ef4444;
          color: white !important;
        }

        .content-class-found {
          background: #7cb305;
          color: white !important;
        }
      `}
    >
      {/*<MonacoEditor*/}
      {/*  loading={<div></div>}*/}
      {/*  height={21}*/}
      {/*  value={value}*/}
      {/*  onChange={(val) => {*/}
      {/*    onChange(val);*/}
      {/*    decorations(val);*/}
      {/*  }}*/}
      {/*  onMount={handleEditorDidMount}*/}
      {/*  options={{*/}
      {/*    minimap: {*/}
      {/*      enabled: false,*/}
      {/*    },*/}
      {/*    lineNumbers: 'off',*/}
      {/*    fontSize: 14,*/}
      {/*    fontFamily: 'IBMPlexMono, "Courier New", monospace',*/}
      {/*    scrollbar: {*/}
      {/*      useShadows: false,*/}
      {/*      vertical: 'hidden',*/}
      {/*      horizontal: 'hidden',*/}
      {/*    },*/}
      {/*    overviewRulerBorder: false,*/}
      {/*    overviewRulerLanes: 0,*/}
      {/*    renderLineHighlight: 'none',*/}
      {/*  }}*/}
      {/*  theme={store.theme === 'light' ? 'light' : 'vs-dark'}*/}
      {/*/>*/}

      <div
        ref={editorRef}
        css={css`
          height: 21px;
          width: 100%;
          //line-height: 30px;
        `}
      ></div>

      <SmartTooltip
        open={open}
        content={<TooltipContent match={textContent} mockEnvironment={store.environment} />}
        left={left}
        top={top}
        contentHeight={0}
      />
    </div>
  );
};

export default SmartEnvInput;
