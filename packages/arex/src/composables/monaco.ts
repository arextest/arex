import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useEffect, useState } from 'react';
// 完全去掉间隙
// https://github.com/microsoft/monaco-editor/issues/1960
type ExtendedEditorConfig = {
  mode: string;
  lineWrapping: boolean;
  theme: string;
  isEndpointInput: boolean;
  readOnly: boolean;
};

export type Options = {
  height?: string;
  extendedEditorConfig: Partial<ExtendedEditorConfig>;
  onChange: (val: string) => void;
};

export function useMonaco(el: any, value: string, options: Options) {
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  const endpointInputMode: monaco.editor.IStandaloneEditorConstructionOptions = {
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
  };

  const normalMode: monaco.editor.IStandaloneEditorConstructionOptions = {
    fontSize: 12,
    wordWrap: 'wordWrapColumn',
  };

  const initView = (el: any) => {
    setEditor(
      monaco.editor.create(el!, {
        ...(options.extendedEditorConfig.isEndpointInput ? endpointInputMode : normalMode),
        value: value,
        language: options.extendedEditorConfig.mode,
        automaticLayout: true,
        fontFamily: 'IBMPlexMono, "Courier New", monospace',
        minimap: {
          enabled: false,
        },
        scrollBeyondLastLine: false,
        theme: options.extendedEditorConfig.theme === 'dark' ? 'vs-dark' : 'vs',
        readOnly: options.extendedEditorConfig.readOnly,
      }),
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

  useEffect(() => {
    if (el.current && el.current.innerHTML === '') {
      if (!editor) {
        initView(el.current);
      }
    }
  }, [options]);

  useEffect(() => {
    editor?.updateOptions({
      theme: options.extendedEditorConfig.theme === 'dark' ? 'vs-dark' : 'vs',
    });
  }, [options]);

  return { editor };
}
