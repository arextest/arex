import { EditorState, StateEffect, StateEffectType, StateField } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { Decoration, DecorationSet, EditorView, ViewUpdate } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { useEffect, useState } from 'react';

import { getStatistics } from './../utils';
import { getMarkFromToArr, HOPP_ENVIRONMENT_REGEX } from './HoppEnvironment';

export interface UseCodeMirror {
  container?: HTMLDivElement | null;
}

export function useEnvCodeMirror(props: UseCodeMirror) {
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
    currentEnv,
  } = props;
  const [container, setContainer] = useState<HTMLDivElement>();
  const [view, setView] = useState<EditorView>();
  const [state, setState] = useState<EditorState>();

  const defaultLightThemeOption = EditorView.theme(
    {
      // '&': {
      //   backgroundColor: '#fff',
      // },
      // '.cm-activeLine': {
      //   backgroundColor: 'rgba(0,0,0,0)',
      // },
      // '.cm-selectionMatch':{
      //   backgroundColor: 'rgba(0,0,0,0)',
      // },
      // '.cm-scroller': {
      //   fontFamily: '"Roboto Mono", monospace',
      //   fontSize: '14px',
      // },
      '.cm-gutters': {
        display: 'none',
      },
    },
    {
      dark: false,
    },
  );
  const defaultThemeOption = EditorView.theme({
    // '&': {
    //   height,
    //   backgroundColor: '#202020',
    //   color: 'white',
    // },
    // '.cm-activeLine': {
    //   backgroundColor: '#202020',
    // },
    // '.cm-selectionMatch':{
    //   backgroundColor: 'rgba(0,0,0,0)',
    // },
    // '.cm-scroller': {
    //   fontFamily: '"Roboto Mono", monospace',
    //   fontSize: '14px',
    // },
    '.cm-gutters': {
      display: 'none',
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

  let getExtensions = [updateListener];

  getExtensions.unshift(basicSetup); //存疑

  switch (theme) {
    case 'light':
      getExtensions.push(defaultLightThemeOption);
      break;
    case 'dark':
      getExtensions.push(defaultThemeOption);
      getExtensions.push(oneDark);
      break;
    default:
      getExtensions.push(theme);
      break;
  }

  getExtensions = getExtensions.concat(extensions);

  const [firstMark, setFirstMark] = useState(true);

  function markFn() {
    if (view) {
      const currentValue = view ? view.state.doc.toString() : '';
      const markArrs = getMarkFromToArr(currentValue, HOPP_ENVIRONMENT_REGEX, currentEnv);
      const foundMarkTheme = EditorView.baseTheme({
        '.cm-found-mark': {
          backgroundColor: '#7cb305',
          borderRadius: '2px',
          color: '#fff',
        },
      });
      const notFoundMarkTheme = EditorView.baseTheme({
        '.cm-not-found-mark': {
          backgroundColor: '#EF4444',
          borderRadius: '2px',
          color: '#fff',
        },
      });

      const foundMark = Decoration.mark({
        class: 'cm-found-mark',
      });
      const notFoundMark = Decoration.mark({
        class: 'cm-not-found-mark',
      });

      const addFoundMarks: StateEffectType<any> = StateEffect.define<{
        from: number;
        to: number;
      }>();
      const addNotFoundMarks: StateEffectType<any> = StateEffect.define<{
        from: number;
        to: number;
      }>();

      const filterMarks = StateEffect.define();
      const markField = StateField.define<DecorationSet>({
        create() {
          return Decoration.none;
        },
        update(marks, tr) {
          marks = marks.map(tr.changes);
          for (const effect of tr.effects) {
            if (effect.is(addFoundMarks)) {
              marks = marks.update({
                add: [foundMark.range(effect.value.from, effect.value.to)],
              });
            }

            if (effect.is(addNotFoundMarks)) {
              marks = marks.update({
                add: [notFoundMark.range(effect.value.from, effect.value.to)],
              });
            }

            if (effect.is(filterMarks)) {
              marks = marks.update({
                filter: effect.value,
              });
            }
          }
          return marks;
        },
        provide: (field) => EditorView.decorations.from(field),
      });
      if (markArrs.length > 0) {
        view?.dispatch({
          effects: [
            ...markArrs
              .filter((i) => !i.found)
              .map((i) => addNotFoundMarks.of({ from: i.from, to: i.to })),
            StateEffect.appendConfig.of([markField, notFoundMarkTheme]),
          ],
        });

        view?.dispatch({
          effects: [
            ...markArrs
              .filter((i) => i.found)
              .map((i) => addFoundMarks.of({ from: i.from, to: i.to })),
            StateEffect.appendConfig.of([markField, foundMarkTheme]),
          ],
        });
      } else {
        view?.dispatch({
          effects: filterMarks.of((from, to) => {
            return to <= 200 || from >= 0;
          }),
        });
      }
    }
  }

  useEffect(() => {
    if (container && !state) {
      const config = {
        doc: value,
        extensions: getExtensions,
      };
      const stateCurrent = initialState
        ? EditorState.fromJSON(initialState.json, config, initialState.fields)
        : EditorState.create(config);

      // EditorState.ran
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
      if (!firstMark) {
        markFn();
      } else {
        setTimeout(() => {
          markFn();
          setFirstMark(false);
        }, 100);
      }
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
