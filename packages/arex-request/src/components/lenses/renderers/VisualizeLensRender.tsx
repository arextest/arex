import { css } from '@arextest/arex-core';
import { useRef } from 'react';

import { useArexRequestStore } from '../../../hooks';
import { genIframeDoc, htmlDecode } from './genIframeDoc';

const VisualizeLensRender = () => {
  const { store } = useArexRequestStore();
  const iframe = useRef(null);

  return (
    <div
      css={css`
        height: 100%;
      `}
    >
      {/*<iframe*/}
      {/*  style={{ width: '100%', height: '100%' }}*/}
      {/*  ref={iframe}*/}
      {/*  allow="fullscreen 'none'; payment 'none';"*/}
      {/*  sandbox='allow-same-origin allow-forms allow-scripts'*/}
      {/*  srcDoc={htmlDecode(*/}
      {/*    genIframeDoc(*/}
      {/*      store?.visualizer?.processedTemplate,*/}
      {/*      JSON.stringify({ types: store?.visualizer?.types, error: store?.visualizer?.error }),*/}
      {/*    ),*/}
      {/*  )}*/}
      {/*/>*/}
    </div>
  );
};

export default VisualizeLensRender;
