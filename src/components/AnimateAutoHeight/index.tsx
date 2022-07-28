import styled from '@emotion/styled';
import * as React from 'react';
import { CSSProperties, FC, ReactNode, useCallback, useMemo, useState } from 'react';
import ResizeObserver from 'react-resize-observer';

interface AnimateAutoHeightProps {
  duration?: number;
  children?: ReactNode;
}

/**
 * 动效高度变化容器
 * @param {number} [duration=250] - 动效时长
 * @param children
 * @constructor
 */
const AnimateAutoHeight: FC<AnimateAutoHeightProps> = ({ duration, children }) => {
  const [height, setHeight] = useState<CSSProperties['height']>('auto');
  const onResize = useCallback((rect: DOMRect) => setHeight(rect.height), [setHeight]);
  const style = useMemo(() => ({ height }), [height]);

  return (
    <Transition style={style} duration={duration}>
      <div className='relativeContainer'>
        {/*@ts-ignore*/}
        <ResizeObserver onResize={onResize} />
        {children}
      </div>
    </Transition>
  );
};

const Transition = styled.div<{
  duration?: number;
}>`
  transition: height ease-in-out ${(props) => props.duration || 250}ms;

  .relativeContainer {
    position: relative;
  }
`;

export default AnimateAutoHeight;
