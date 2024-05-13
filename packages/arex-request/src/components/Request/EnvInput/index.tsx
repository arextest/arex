// @ts-nocheck

import { styled, Theme, useArexCoreConfig } from '@arextest/arex-core';
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React, { FC, useEffect, useRef, useState } from 'react';

import { getMarkFromToArr, REGEX_ENV_VAR } from '../../../helpers/editor/getMarkFromToArr';
import { useArexRequestStore } from '../../../hooks';
import EnvTooltip from './EnvTooltip';

interface SmartEnvInputProps {
  status?: 'error';
  disabled?: boolean;
  value?: string;
  onChange?: (value?: string) => void;
}

const EditorWrapper = styled.div<Pick<SmartEnvInputProps, 'status'>>`
  .content-class-no-found {
    background: ${(props) => props.theme.colorError};
    color: white !important;
    border-radius: 2px;
  }

  .content-class-found {
    background: ${(props) => props.theme.colorSuccess};
    color: white !important;
    border-radius: 2px;
  }
  border: 1px solid
    ${(props) =>
      props.status === 'error' ? props.theme.colorErrorBorder : props.theme.colorBorder};
  border-radius: 0 6px 6px 0;
  z-index: 1;
  flex: 1;
  //添加 min-width: 0 的原因: https://juejin.cn/post/6974356682574921765
  min-width: 0;
  display: flex;
  align-items: center;
  //overflow-y: hidden;
`;

const editOptions = {
  wordWrap: 'off',
  automaticLayout: true,
  fontFamily: 'IBMPlexMono, "Courier New", monospace',
  minimap: {
    enabled: false,
  },
  scrollBeyondLastLine: false,
  fontSize: 14,
  scrollbar: {
    useShadows: false,
    vertical: 'hidden',
    horizontal: 'hidden',
  },
  overviewRulerBorder: false,
  overviewRulerLanes: 0,
  renderLineHighlight: 'none',
  quickSuggestions: false,
  lineNumbers: 'off',
  links: false,
  folding: false,
} as const;

const SmartEnvInput: FC<SmartEnvInputProps> = ({ value, status, onChange, disabled }) => {
  const { store } = useArexRequestStore();
  const { theme } = useArexCoreConfig();
  const [open, setOpen] = useState(false);
  const [left, setLeft] = useState(0);
  const [textContent, setTextContent] = useState('');
  const smartEnvInputRef = useRef<HTMLDivElement>(null);

  const [editor, setEditor] = useState(false);

  function mouseoverFn(e: any) {
    setLeft(e.target.offsetLeft);
    setOpen(true);
    setTextContent(e.target.textContent);
  }
  function mouseoutFn() {
    setOpen(false);
  }

  const editorRef = useRef(null);

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
    editor.onKeyDown((e: React.KeyboardEvent) => {
      if (e.keyCode === monaco.KeyCode.Enter) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
    setEditor(editor);
  }
  useEffect(() => {
    if (editor) {
      decorations(value, editor);
    }
  }, [editor, value]);
  // ============================== 鼠标mouseenter时，为所有mark添加mouse事件 ==============================
  useEffect(() => {
    if (smartEnvInputRef.current) {
      smartEnvInputRef.current.addEventListener('mouseenter', (e) => {
        const foundDomList = document.querySelectorAll('.content-class-found');
        const noFoundDomList = document.querySelectorAll('.content-class-no-found');
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
    const marks = getMarkFromToArr(value, REGEX_ENV_VAR, store.environment);
    const ids = [];
    const decorations = editor?.getModel?.().getAllDecorations() || [];
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
      editor?.deltaDecorations?.(ids, []);
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

    editor?.deltaDecorations?.(
      [], // oldDecorations 每次清空上次标记的
      rs,
    );
  }

  return (
    <EditorWrapper ref={smartEnvInputRef} status={status}>
      <EnvTooltip
        offset={[left, -2]}
        open={open}
        match={textContent}
        mockEnvironment={store.environment}
      >
        <Editor
          height='21px'
          value={value}
          theme={theme === Theme.dark ? 'vs-dark' : 'light'}
          onMount={handleEditorDidMount}
          onChange={(val) => {
            onChange?.(val);
            decorations(val, editor);
          }}
          options={editOptions}
        />
      </EnvTooltip>
    </EditorWrapper>
  );
};

export default SmartEnvInput;
