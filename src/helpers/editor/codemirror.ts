import { EditorState, Extension, StateEffect, StateField } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, ViewUpdate } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { useEffect, useState } from 'react';

import { ThemeClassify } from '../../style/theme';
import { getStatistics, Statistics } from './utils';
// import {defaultKeymap} from "@codemirror/commands"

export interface UseCodeMirrorProps {
  value: string;
  container?: HTMLDivElement | null;
  initialState?: {
    json: any;
    fields?: { [p: string]: StateField<any> };
  };
  root?: Document | ShadowRoot | undefined;
  theme: ThemeClassify | Extension;
  extensions?: Extension[];
  height: number | string | null;
  onCreateEditor?: (editorView: EditorView, editorState: EditorState) => void;
  onStatistics?: (statistics: Statistics) => void;
  onChange?: (value: string, vu: ViewUpdate) => void;
}

export function useCodeMirror(props: UseCodeMirrorProps) {
  const {
    value,
    initialState,
    root,
    onCreateEditor,
    theme = 'light',
    extensions,
    height,
    onStatistics,
    onChange,
  } = props;
  const [container, setContainer] = useState<HTMLDivElement>();
  const [view, setView] = useState<EditorView>();
  const [state, setState] = useState<EditorState>();

  const defaultLightThemeOption = EditorView.theme(
    {
      '&': {
        backgroundColor: '#fff',
      },
      '.cm-scroller': {
        fontFamily: '"Roboto Mono", monospace',
        fontSize: '14px',
      },
    },
    {
      dark: false,
    },
  );
  const defaultThemeOption = EditorView.theme({
    '&': {
      height,
    },
  });
  const updateListener = EditorView.updateListener.of((vu: ViewUpdate) => {
    if (vu.docChanged && typeof onChange === 'function') {
      const doc = vu.state.doc;
      const value = doc.toString();
      onChange(value, vu);
    }
    onStatistics && onStatistics(getStatistics(vu));
  });

  const getExtensions = [updateListener, defaultThemeOption];

  getExtensions.unshift(basicSetup); //存疑

  switch (theme) {
    case 'light':
      getExtensions.push(defaultLightThemeOption);
      break;
    case 'dark':
      getExtensions.push(oneDark);
      break;
    default:
      getExtensions.push(theme as Extension);
      break;
  }

  extensions && getExtensions.push(extensions);

  useEffect(() => {
    if (container && !state) {
      const config = {
        doc: value,
        extensions: getExtensions,
      };
      const stateCurrent = initialState
        ? EditorState.fromJSON(initialState.json, config, initialState.fields)
        : EditorState.create(config);
      setState(stateCurrent);
      if (!view) {
        const viewCurrent = new EditorView({
          state: stateCurrent,
          parent: container,
          root,
        });
        setView(viewCurrent);
        onCreateEditor && onCreateEditor(viewCurrent, stateCurrent);
      }
    }
    return () => {
      if (view) {
        setState(undefined);
        setView(undefined);
      }
    };
  }, [container, state]);

  useEffect(() => setContainer(props.container!), [props.container]);

  // view改变，更新
  useEffect(
    () => () => {
      if (view) {
        view.destroy();
        setView(undefined);
      }
    },
    [view],
  );

  // 外部配置改变，更新
  useEffect(() => {
    if (view) {
      view.dispatch({ effects: StateEffect.reconfigure.of(getExtensions) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, extensions, height]);

  // 外部value改变，更新
  useEffect(() => {
    const currentValue = view ? view.state.doc.toString() : '';
    if (view && value !== currentValue) {
      view.dispatch({
        changes: { from: 0, to: currentValue.length, insert: value || '' },
      });
    }
  }, [value, view]);

  return { state, setState, view, setView, container, setContainer };
}
