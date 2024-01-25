import {
  HiddenValue,
  JSONEditor as VanillaJSONEditor,
  JSONEditorPropsOptional,
  OnRenderContextMenu,
  ReadonlyValue,
} from '@arextest/vanilla-jsoneditor';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { theme as antdTheme } from 'antd';
import { parse, stringify } from 'lossless-json';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import { useArexCoreConfig } from '../../hooks';

const LosslessJSONParser = { parse, stringify };

export interface VanillaJSONEditorProps extends JSONEditorPropsOptional {
  height?: string | number;
  remark?: string;
}

const EditorWaterMark = styled.div<{
  remark?: string;
}>`
  height: 100%;
  position: relative;
  :after {
    content: '${(props) => props.remark || ''}';
    position: absolute;
    bottom: 8px;
    right: 32px;
    font-size: 32px;
    font-weight: 600;
    font-style: italic;
    color: ${(props) => props.theme.colorTextQuaternary};
    z-index: 0;
  }
`;

export interface JSONEditorProps extends VanillaJSONEditorProps {
  hiddenValue?: boolean;
  onRenderContextMenu: OnRenderContextMenu;
}

export interface JSONEditorRef {
  scrollTo: (path: (string | number)[]) => void;
}

const JSONEditor = forwardRef<JSONEditorRef, JSONEditorProps>((props, ref) => {
  const { hiddenValue = false } = props;

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
        ...props,
      },
    });

    return () => {
      if (refEditor.current) {
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, [hiddenValue]);

  // update props
  useEffect(() => {
    refEditor.current?.updateProps(props);
  }, [props]);

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
