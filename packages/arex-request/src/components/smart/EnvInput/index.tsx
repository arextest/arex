import { styled, Theme, useArexCoreConfig } from '@arextest/arex-core';
import Editor from '@arextest/monaco-react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { FC, useEffect, useRef, useState } from 'react';

import { getMarkFromToArr, REGEX_ENV_VAR } from '../../../helpers/editor/getMarkFromToArr';
import { useArexRequestStore } from '../../../hooks';
import SmartTooltip from '../Tooltip';
import TooltipContent from './TooltipContent';
import { getElementViewPosition } from './util';

interface SmartEnvInputProps {
  disabled: boolean;
  value?: string;
  onChange: (e: any) => void;
}

const EditorWrapper = styled.div`
  .content-class-no-found {
    background: #ef4444;
    color: white !important;
    border-radius: 2px;
  }

  .content-class-found {
    background: #7cb305;
    color: white !important;
    border-radius: 2px;
  }
  border: 1px solid ${(props) => props.theme.colorBorder};
  border-radius: 0 6px 6px 0;
  flex: 1;
  //添加 min-width: 0 的原因: https://juejin.cn/post/6974356682574921765
  min-width: 0;
  display: flex;
  align-items: center;
  //overflow-y: hidden;
`;

const SmartEnvInput: FC<SmartEnvInputProps> = ({ value, onChange, disabled }) => {
  const { store } = useArexRequestStore();
  const { theme } = useArexCoreConfig();
  const [open, setOpen] = useState(false);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [textContent, setTextContent] = useState('');
  const smartEnvInputRef = useRef<HTMLDivElement>(null);

  const [editor, setEditor] = useState(false);

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
    <EditorWrapper ref={smartEnvInputRef}>
      <Editor
        height='21px'
        value={value}
        theme={theme === Theme.dark ? 'vs-dark' : 'light'}
        onMount={handleEditorDidMount}
        onChange={(val) => {
          onChange(val);
          decorations(val, editor);
        }}
        options={{
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
        }}
      />

      <SmartTooltip
        open={open}
        content={<TooltipContent match={textContent} mockEnvironment={store.environment} />}
        left={left}
        top={top}
        contentHeight={0}
      />
    </EditorWrapper>
  );
};

export default SmartEnvInput;
