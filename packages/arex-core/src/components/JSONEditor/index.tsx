import { css } from '@emotion/react';
import { theme as antdTheme } from 'antd';
import { parse, stringify } from 'lossless-json';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import {
  ContextMenuItem,
  JSONContent,
  JSONEditor as VanillaJSONEditor,
  JSONEditorPropsOptional,
  KeySelection as JSONKeySelection,
  KeySelection,
  OnRenderValue,
  OnSelect,
  ReadonlyValue,
  RenderMenuContext,
  TextContent,
} from 'vanilla-jsoneditor';

import { useArexCoreConfig } from '../../hooks';
import { getJsonValueByPath } from '../../utils';
import EditorWaterMark from './EditorWaterMark';
import { PasswordAction } from './PasswordAction';

const LosslessJSONParser = { parse, stringify };

type Context = RenderMenuContext & { selection: JSONKeySelection };
export interface ContextWithValue extends Context {
  value: any;
}

export interface SelectionWithValue extends JSONKeySelection {
  value: any;
}

export type OnRenderContextMenu = (
  items: ContextMenuItem[],
  context: ContextWithValue,
) => ContextMenuItem[] | false | undefined;

export interface VanillaJSONEditorProps extends JSONEditorPropsOptional {
  height?: string | number;
  remark?: string;
}

export interface JSONEditorProps
  extends Omit<VanillaJSONEditorProps, 'onSelect' | 'onRenderContextMenu'> {
  hiddenValue?: boolean;
  onSelect?: (selection: SelectionWithValue) => void;
  onRenderContextMenu?: OnRenderContextMenu;
}

export interface JSONEditorRef {
  scrollTo: (path: (string | number)[]) => void;
}
const JSONEditor = forwardRef<JSONEditorRef, JSONEditorProps>((props, ref) => {
  const { hiddenValue = false, onSelect, onRenderContextMenu, ...restProps } = props;

  const { token } = antdTheme.useToken();
  const { theme } = useArexCoreConfig();

  const refContainer = useRef<HTMLDivElement>(null);
  const refEditor = useRef<any>(null);

  useEffect(() => {
    refEditor.current = new VanillaJSONEditor({
      target: refContainer.current!,
      props: {
        parser: LosslessJSONParser,
        navigationBar: false,
        mainMenuBar: false,
        ...restProps,
      },
    });

    return () => {
      if (refEditor.current) {
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  // update props
  useEffect(() => {
    refEditor.current?.updateProps({
      onRenderValue: ((props) =>
        hiddenValue
          ? [
              {
                action: PasswordAction,
                props: props as Record<string, any>,
              },
            ]
          : [
              {
                component: ReadonlyValue,
                props: props as Record<string, any>,
              },
            ]) as OnRenderValue,
      onSelect: ((selection) => {
        // disable multi type selection
        if (!['key', 'value'].includes(selection?.type || '')) return [];

        const path = (selection as KeySelection)?.path;
        const value = getJsonValueByPath(
          (props.content as TextContent)?.text || (props.content as JSONContent)?.json,
          path,
        );

        const selectionWithValue = {
          ...selection,
          value,
        };
        return onSelect?.(selectionWithValue as unknown as SelectionWithValue);
      }) as OnSelect,
      onRenderContextMenu: ((items, context) => {
        // disable multi type selection
        if (hiddenValue || !['key', 'value'].includes(context?.selection?.type || '')) return false;

        const path = context?.selection?.path;
        const value = getJsonValueByPath(
          (props.content as TextContent)?.text || (props.content as JSONContent)?.json,
          path,
        );
        const selectionWithValue: ContextWithValue = {
          ...context,
          value,
        };

        return onRenderContextMenu?.(items, selectionWithValue);
      }) as OnRenderContextMenu,
      ...restProps,
    });
  }, [hiddenValue, onRenderContextMenu, onSelect, props, restProps]);

  useImperativeHandle(
    ref,
    () => ({
      scrollTo: (to) => refEditor.current?.scrollTo(to),
    }),
    [],
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
          .json-additional-node,
          .json-additional-refer-node {
            background-color: ${token.colorWarningBgHover};
          }
          .json-additional-refer-node {
            animation: fadeOut 2s 1s forwards;
          }
          .node-type-object::after,
          .node-type-array::after,
          .node-type-null::after,
          .node-type-string::after,
          .node-type-int::after,
          .node-type-long::after,
          .node-type-double::after,
          .node-type-float::after,
          .node-type-bigInteger::after,
          .node-type-bigDecimal::after,
          .node-type-boolean::after,
          .node-type-simpleClassName::after {
            color: ${theme === 'dark' ? '#bdbdbd' : '#00000033'};
            position: absolute;
            top: 0;
            right: 8px;
          }

          .node-type-object::after {
            content: '[object]';
          }
          .node-type-array::after {
            content: '[array]';
          }
          .node-type-null::after {
            content: '[null]';
          }
          .node-type-string::after {
            content: '[string]';
          }
          .node-type-int::after {
            content: '[int]';
          }
          .node-type-long::after {
            content: '[long]';
          }
          .node-type-double::after {
            content: '[double]';
          }
          .node-type-float::after {
            content: '[float]';
          }
          .node-type-bigInteger::after {
            content: '[bigInteger]';
          }
          .node-type-bigDecimal::after {
            content: '[bigDecimal]';
          }
          .node-type-boolean::after {
            content: '[boolean]';
          }
          .node-type-simpleClassName::after {
            content: '[simpleClassName]';
          }

          @keyframes fadeOut {
            from {
              background-color: ${token.colorWarningBgHover};
            }
            to {
              background-color: transparent;
            }
          }
        `}
      />
    </EditorWaterMark>
  );
});

export default JSONEditor;
