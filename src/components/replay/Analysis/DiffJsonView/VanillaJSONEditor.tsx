import { css } from '@emotion/react';
import { useEffect, useRef } from 'react';
import { JSONEditor } from 'vanilla-jsoneditor';

export default function SvelteJSONEditor(props: any) {
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
        console.log(allDiffByType, 'scrollTo');
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
        height: 85vh;
      `}
      ref={refContainer}
    ></div>
  );
}
