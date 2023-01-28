import { useMount } from 'ahooks';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useEffect, useState } from 'react';

type ExtendedEditorConfig = {
  mode: string;
  placeholder: string;
  readOnly: boolean;
  lineWrapping: boolean;
  theme: string;
  isEndpointInput: boolean;
};

type MonacoOptions = {
  extendedEditorConfig: Partial<ExtendedEditorConfig>;
  environmentHighlights: boolean;
  onChange: any;
};

export function useMonaco(el: any, value: any, options: MonacoOptions) {
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  const mode1: any = {
    value: value,
    language: options.extendedEditorConfig.mode,
    automaticLayout: true,
    fontFamily: 'IBMPlexMono, "Courier New", monospace',
    minimap: {
      enabled: false,
    },
    scrollBeyondLastLine: false,
    wordWrap: 'wordWrapColumn',
    theme: options.extendedEditorConfig.theme === 'dark' ? 'vs-dark' : 'vs',

    // minimap: {
    //   enabled: false,
    // },
    lineNumbers: 'off',
    fontSize: 14,
    // fontFamily: 'IBMPlexMono, "Courier New", monospace',
    scrollbar: {
      useShadows: false,
      vertical: 'hidden',
      horizontal: 'hidden',
    },
    overviewRulerBorder: false,
    overviewRulerLanes: 0,
    renderLineHighlight: 'none',
    // lineHeight:30
  };

  const mode2: any = {
    value: value,
    language: options.extendedEditorConfig.mode,
    automaticLayout: true,
    fontFamily: 'IBMPlexMono, "Courier New", monospace',
    minimap: {
      enabled: false,
    },
    scrollBeyondLastLine: false,
    wordWrap: 'wordWrapColumn',
    theme: options.extendedEditorConfig.theme === 'dark' ? 'vs-dark' : 'vs',

    // minimap: {
    //   enabled: false,
    // },
    lineNumbers: 'off',
    fontSize: 12,
    // fontFamily: 'IBMPlexMono, "Courier New", monospace',
    // scrollbar: {
    //   useShadows: false,
    //   vertical: 'hidden',
    //   horizontal: 'hidden',
    // },
    // overviewRulerBorder: false,
    // overviewRulerLanes: 0,
    // renderLineHighlight: 'none',
    // lineHeight:30
  };

  const initView = (el: any) => {
    setEditor(
      monaco.editor.create(el!, options.extendedEditorConfig.isEndpointInput ? mode1 : mode2),
    );
  };

  useEffect(() => {
    if (editor) {
      editor?.getModel()?.onDidChangeContent((event) => {
        options.onChange(editor.getValue());
      });
    }
  }, [editor]);

  useEffect(() => {
    if (editor) {
      if (value !== editor.getValue()) {
        const range = editor.getModel()?.getFullModelRange();
        if (range) {
          editor.executeEdits('', [
            {
              range: range,
              text: value,
              forceMoveMarkers: true,
            },
          ]);
        }
      }
    }
  }, [value]);

  useMount(() => {
    if (el.current && el.current.innerHTML === '') {
      if (!editor) {
        initView(el.current);
      }
    }
  });

  return { editor };
}
