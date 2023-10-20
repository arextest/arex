import { css } from '@emotion/react';
import { useHover } from 'ahooks';
import { theme } from 'antd';
import { FC, useRef } from 'react';

import { isMac } from '@/constant';

const MacTrafficLightBackground: FC = () => {
  const ref = useRef(null);
  const hover = useHover(ref);
  const { token } = theme.useToken();
  if (!isMac) return null;

  return (
    <div
      ref={ref}
      css={css`
        width: 62px;
        height: 26px;
        left: 0;
        top: 0;
        background-color: ${hover ? token.colorBgElevated : 'transparent'};
        transition: background-color 0.25s ease;
        position: absolute;
        z-index: 99;
      `}
    />
  );
};
export default MacTrafficLightBackground;
