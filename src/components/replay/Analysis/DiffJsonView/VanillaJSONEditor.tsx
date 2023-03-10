import { css } from '@emotion/react';
import React, { useEffect, useRef } from 'react';
import { JSONEditor } from 'vanilla-jsoneditor';

export type SvelteJSONEditorProps = {
  height?: string | number;
} & any;

export default function SvelteJSONEditor(props: SvelteJSONEditorProps) {
  const refContainer = useRef<any>(null);
  const refEditor = useRef<any>(null);
  const { allDiffByType } = props;
  useEffect(() => {
    refEditor.current = new JSONEditor({
      target: refContainer.current,
      props: {},
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

  return (
    <div
      css={css`
        height: ${props.height};
      `}
      ref={refContainer}
    ></div>
  );
}
