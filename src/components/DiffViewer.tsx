import 'codemirror/addon/merge/merge.css';
import 'codemirror/addon/merge/merge.js';
import 'codemirror/theme/neat.css';
import 'codemirror/theme/gruvbox-dark.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';

import styled from '@emotion/styled';
import CodeMirror from 'codemirror';
import DiffMatchPatch from 'diff-match-patch';
import { FC, useEffect, useRef, useState } from 'react';

import { useStore } from '../store';
import { Theme } from '../style/theme';

const DiffView = styled.div<{ theme: Theme }>`
  // 主体样式
  .CodeMirror,
  .CodeMirror-merge {
    height: 600px;
    border-color: ${({ theme }) => (theme === Theme.light ? '#f0f0f0' : '#303030')};
  }

  // 左右文本差异高亮样式
  .CodeMirror-merge-r-chunk-start {
    border-top: 1px solid
      ${({ theme = Theme.light }) => (theme === Theme.light ? '#ee8' : '#959582')};
  }
  .CodeMirror-merge-r-chunk-end {
    border-bottom: 1px solid
      ${({ theme = Theme.light }) => (theme === Theme.light ? '#ee8' : '#959582')};
  }
  .CodeMirror-merge-r-chunk {
    background-color: ${({ theme = Theme.light }) =>
      theme === Theme.light ? '#ffffe0' : '#787869'};
  }

  // 中间分隔区样式
  .CodeMirror-merge-gap {
    border-color: ${({ theme }) => (theme === Theme.light ? 'inherit' : '#959582')};
    background-color: ${({ theme = Theme.light }) =>
      theme === Theme.light ? '#f8f8f8' : '#282828'} !important;
    path {
      stroke: ${({ theme = Theme.light }) => (theme === Theme.light ? '#ee8' : '#959582')};
      fill: ${({ theme = Theme.light }) => (theme === Theme.light ? '#ffffe0' : '#787869')};
    }
  }

  // 水平滚动条样式 （垂直滚动条样式已在全局样式中设置）
  .CodeMirror-hscrollbar {
    height: 6px;
    border-radius: 3px;
    background: #88888844;
  }
`;
// @ts-ignore
window.diff_match_patch = DiffMatchPatch;
// @ts-ignore
window.DIFF_DELETE = -1;
// @ts-ignore
window.DIFF_INSERT = 1;
// @ts-ignore
window.DIFF_EQUAL = 0;

const onChange = (key: string) => {
  console.log(key);
};

const DiffViewer: FC<{ left: object | string; right: object | string }> = ({ left, right }) => {
  const diffView = useRef<HTMLDivElement>(null);
  const theme = useStore((store) => store.theme);
  let mergeView;
  useEffect(() => {
    if (!diffView.current) {
      return;
    }

    const diffViewElement = document.querySelector('#diffView');
    diffViewElement && (diffViewElement.innerHTML = '');
    mergeView = CodeMirror.MergeView(diffView.current, {
      readOnly: true, // 只读
      lineNumbers: true, // 显示行号
      theme: theme === 'light' ? 'neat' : 'gruvbox-dark', // 设置主题
      value: JSON.stringify(left, null, 2), // 左边的内容（新内容）
      orig: JSON.stringify(right, null, 2), // 右边的内容（旧内容）
      mode: 'html', // 代码模式为js模式
      viewportMargin: Infinity, // 允许滚动的距离
      highlightDifferences: true, // 有差异的地方是否高亮
      revertButtons: false, // revert按钮设置为true可以回滚
      styleActiveLine: true, // 光标所在的位置代码高亮
      lineWrap: false, // 文字过长时，是换行(wrap)还是滚动(scroll),默认是滚动
      smartIndent: true, // 智能缩进
      matchBrackets: true, // 括号匹配
      foldGutter: true, // 代码折叠
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      // 智能提示
      extraKeys: {
        'Alt-/': 'autocomplete',
        // F11: function (cm) {
        //   cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        // },
      },
    });
    // mergeView.editor().setSize(null, "100%");
  }, [left, right]);

  return <DiffView id='diffView' ref={diffView} theme={theme} />;
};

export default DiffViewer;
