import { JSONEditor, JSONEditorPropsOptional, ReadonlyValue } from '@arextest/vanilla-jsoneditor';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from 'antd';
import { parse, stringify } from 'lossless-json';
import React, { useEffect, useRef } from 'react';

import { AllDiff } from './helper';

const LosslessJSONParser = { parse, stringify };

export interface SvelteJSONEditorProps extends JSONEditorPropsOptional {
  height?: string | number;
  remark?: string;
  allDiffByType?: AllDiff;
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

export default function SvelteJSONEditor(props: SvelteJSONEditorProps) {
  const refContainer = useRef<HTMLDivElement>(null);
  const refEditor = useRef<any>(null);
  const { token } = theme.useToken();

  useEffect(() => {
    refEditor.current = new JSONEditor({
      target: refContainer.current!,
      props: {
        // @ts-ignore
        // disable build-in render component
        onRenderValue: (props) => [{ component: ReadonlyValue, props }],
        // parse bigInt
        // @ts-ignore
        parser: LosslessJSONParser,
        navigationBar: false,
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
    if (refEditor.current) {
      refEditor.current.updateProps(props);
      setTimeout(() => {
        if (props.allDiffByType?.more.length) {
          refEditor.current.scrollTo(props.allDiffByType?.more[0]);
        } else if (props.allDiffByType?.diff.length) {
          refEditor.current.scrollTo(props.allDiffByType?.diff[0]);
        }
      }, 100);
    }
  }, [props]);

  return (
    <EditorWaterMark remark={props.remark}>
      <div
        css={css`
          height: ${props.height};
        `}
        ref={refContainer}
      />
    </EditorWaterMark>
  );
}
