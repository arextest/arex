import { css } from '@emotion/react';
import { Segmented } from 'antd';

import VisualizeLensRender from './VisualizeLensRender';

const BodySegmented = ({ response }: any) => {
  return (
    <div
      css={css`
        height: calc(100% - 10px);
        display: flex;
        flex-direction: column;
      `}
    >
      <Segmented options={['Pretty', 'Raw', 'Preview', 'Visualize']} />
      {/*<VisualizeLensRender response={response}/>*/}
    </div>
  );
};

export default BodySegmented;
