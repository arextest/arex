import {
  ContextMenuItem,
  HiddenValue,
  JSONContent,
  JSONEditor as VanillaJSONEditor,
  JSONEditorPropsOptional,
  KeySelection,
  ReadonlyValue,
  TextContent,
} from '@arextest/vanilla-jsoneditor';
import { css } from '@emotion/react';
import { theme as antdTheme } from 'antd';
import { parse, stringify } from 'lossless-json';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import { useArexCoreConfig } from '../../hooks';
import { getJsonValueByPath } from '../../utils';
import EditorWaterMark from './EditorWaterMark';

const LosslessJSONParser = { parse, stringify };

export interface KeySelectionWithValue extends KeySelection {
  value: any;
}
export type OnRenderContextMenu = (
  items: ContextMenuItem[],
  selection: KeySelectionWithValue,
) => ContextMenuItem[] | undefined;

export interface VanillaJSONEditorProps extends JSONEditorPropsOptional {
  height?: string | number;
  remark?: string;
}

export interface JSONEditorProps extends VanillaJSONEditorProps {
  hiddenValue?: boolean;
  onRenderContextMenu?: OnRenderContextMenu;
}

export interface JSONEditorRef {
  scrollTo: (path: (string | number)[]) => void;
}
const JSONEditor = forwardRef<JSONEditorRef, JSONEditorProps>((props, ref) => {
  const { hiddenValue = false, onRenderContextMenu, ...restProps } = props;

  const { token } = antdTheme.useToken();
  const { theme } = useArexCoreConfig();

  const refContainer = useRef<HTMLDivElement>(null);
  const refEditor = useRef<any>(null);

  useEffect(() => {
    refEditor.current = new VanillaJSONEditor({
      target: refContainer.current!,
      props: {
        // @ts-ignore
        // disable build-in render component
        onRenderValue: (props) => [
          {
            component: hiddenValue ? HiddenValue : ReadonlyValue,
            props,
          },
        ],
        // @ts-ignore
        parser: LosslessJSONParser,
        navigationBar: false,
        mainMenuBar: false,
        onRenderContextMenu: (items, context) => {
          // disable multi type selection
          if (!['key', 'value'].includes(context.selection?.type || '')) return [];

          const path = (context.selection as KeySelection)?.path;
          const value = getJsonValueByPath(
            (props.content as TextContent)?.text || (props.content as JSONContent)?.json,
            path,
          );
          const selection: KeySelectionWithValue = {
            ...(context.selection as KeySelection),
            value,
          };

          return onRenderContextMenu?.(items, selection);
        },
        ...restProps,
      },
    });

    return () => {
      if (refEditor.current) {
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, [hiddenValue]);

  // update props // TODO onRenderContextMenu update
  useEffect(() => {
    refEditor.current?.updateProps(restProps);
  }, [restProps]);

  useImperativeHandle(
    ref,
    () => ({
      scrollTo: refEditor.current?.scrollTo,
    }),
    [refEditor.current],
  );

  return (
    <EditorWaterMark remark={props.remark}>
      <div
        ref={refContainer}
        className={`${theme === 'dark' ? 'jse-theme-dark' : ''}`}
        css={css`
          height: ${props.height};
          .json-difference-node {
            background-color: ${token.colorInfoBgHover};
          }
          .json-additional-node {
            background-color: ${token.colorWarningBgHover};
          }
        `}
      />
    </EditorWaterMark>
  );
});

export default JSONEditor;
