import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { parse, stringify } from 'lossless-json';
import React, { useEffect, useRef } from 'react';
import { JSONEditor } from 'vanilla-jsoneditor';

const LosslessJSONParser = { parse, stringify };

export type SvelteJSONEditorProps = {
  height?: string | number;
  remark?: string;
} & any;

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
  const refContainer = useRef<any>(null);
  const refEditor = useRef<any>(null);
  const { allDiffByType } = props;
  useEffect(() => {
    refEditor.current = new JSONEditor({
      target: refContainer.current,
      props: {
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
        if (allDiffByType.diff3.length > 0) {
          refEditor.current.scrollTo(allDiffByType.diff3[0]);
        } else if (allDiffByType.diff012.length > 0) {
          refEditor.current.scrollTo(allDiffByType.diff012[0]);
        }
      }, 100);
    }
  }, [props]);
  const theme = useTheme();

  return (
    <EditorWaterMark remark={props.remark}>
      <div
        css={css`
          height: ${props.height};
          .jse-value,
          .jse-key {
            color: ${theme.colorText} !important;
          }
        `}
        ref={refContainer}
      />
    </EditorWaterMark>
  );
}
