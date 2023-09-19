import { css } from '@emotion/react';
import { useContext, useEffect, useRef } from 'react';

import { Context } from '../../../../../providers/ConfigProvider';
import { genIframeDoc, htmlDecode } from './genIframeDoc';

const VisualizeLensRender = () => {
  // const { store } = useContext(Context);
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
      {/*  id='b8d76366-f724-4ac4-820b-62d3268dd9e3'*/}
      {/*  name='b8d76366-f724-4ac4-820b-62d3268dd9e3'*/}
      {/*  allow="fullscreen 'none'; payment 'none';"*/}
      {/*  sandbox='allow-same-origin allow-forms allow-scripts'*/}
      {/*  srcDoc={htmlDecode(*/}
      {/*    genIframeDoc(*/}
      {/*      store?.visualizer?.processedTemplate,*/}
      {/*      JSON.stringify({ data: store.visualizer.data, error: store.visualizer.error }),*/}
      {/*    ),*/}
      {/*  )}*/}
      {/*/>*/}
    </div>
  );
};

export default VisualizeLensRender;
