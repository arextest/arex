import { css } from '@emotion/react';
// import axios from 'axios';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { HttpContext } from '../../../index';

const VisualizeLensRender = () => {
  const { store } = useContext(HttpContext);
  const [template, setTemplate] = useState('');
  const [data, setData] = useState<any>('');
  const [visualizeTemplate, setVisualizeTemplate] = useState('');
  useEffect(() => {
    const { data: storeData } = store.ewaiResult.res.return.visualizer;
    const { template: storeTemplate } = store.ewaiResult.res.return.visualizer;
    setTemplate(storeTemplate);
    setData(storeData);

    // axios({
    //   method: 'GET',
    //   url: '/api/visualize',
    //   data: { t: Math.random() },
    // }).then((res) => {
    //   setVisualizeTemplate(res.data);
    // });
  }, [store.ewaiResult]);

  const srcDoc = useMemo(() => {
    if (data && template && visualizeTemplate) {
      return visualizeTemplate
        .replaceAll('$$$$', template)
        .replaceAll('####', JSON.stringify(data));
    } else {
      return '';
    }
  }, [data, template, visualizeTemplate]);

  return (
    <div
      css={css`
        flex: 1;
      `}
    >
      {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
      <iframe style={{ width: '100%', height: '100%', border: 'none' }} srcDoc={srcDoc} />
    </div>
  );
};

export default VisualizeLensRender;
