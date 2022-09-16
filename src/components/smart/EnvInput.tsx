import './EnvInput.less';

import CodeMirror from 'codemirror';
import { FC, useEffect, useRef, useState } from 'react';

import { useStore } from '../../store';

interface SmartEnvInputProps {
  value: string;
  onChange: (e: any) => void;
}
const SmartEnvInput: FC<SmartEnvInputProps> = ({ value, onChange }) => {
  const [editor, setEditor] = useState(null);
  const [count, setCount] = useState(0);
  const smartEnvInputRef = useRef(null);
  const { themeClassify } = useStore();
  useEffect(() => {
    if (smartEnvInputRef && !editor) {
      setEditor(
        CodeMirror.fromTextArea(smartEnvInputRef.current, {
          mode: 'text',
          styleActiveLine: true, // 当前行高亮
          lineNumbers: false, // 显示行号
          input: function () {
            console.log('input');
          },
          height: '30px', //设置初始化高度
          lineWrapping: false,
          // theme: themeClassify === ThemeClassify.light ? 'neat' : 'gruvbox-dark'
        }),
      );
    }
    // theme: themeClassify === ThemeClassify.light ? 'neat' : 'gruvbox-dark', // 设置主题
    editor?.on('change', () => {
      onChange({
        target: {
          value: editor.getValue(),
        },
      });
      // 每次清除之前mark
      editor.doc.getAllMarks().forEach((marker) => marker.clear());
      // 正则匹配{{}}
      const editorValueMatch = editor.getValue().match(/\{\{(.+?)\}\}/g);
      // 匹配到时才mark
      // TODO暂时只做了单个{{}}的匹配
      if (editorValueMatch && editorValueMatch[0]) {
        const matchValueLeftRight = editor.getValue().split(editorValueMatch[0]);
        // 寻找标记的起始位置
        const start = matchValueLeftRight[0].length;
        const end = matchValueLeftRight[0].length + editorValueMatch[0].length;
        // 开始mark
        editor.getDoc().markText(
          {
            line: 0,
            ch: start,
          },
          {
            line: 0,
            ch: end,
          },
          {
            className: 'smart-env-input-highlight',
          },
        );
      }
    });
  }, [smartEnvInputRef.current]);

  useEffect(() => {
    if (count === 0 && value) {
      editor?.setValue(value);
      setCount(count + 1);
    }
  }, [value]);
  return (
    <div className={'smart-env'}>
      <textarea ref={smartEnvInputRef} id='smart-env-input'>
        {value}
      </textarea>
    </div>
  );
};

export default SmartEnvInput;
