import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { FC, ReactNode, useEffect, useRef } from 'react';

import { Color } from '../style/theme';

type Direction = 'horizontal' | 'vertical';

const DividerLine = styled.div<{ direction: Direction }>`
  width: ${(props) => (props.direction === 'vertical' ? '100%' : '1px')};
  height: ${(props) => (props.direction === 'vertical' ? '1px' : '100%')};
  background-color: #eee;
  transition: box-shadow 0.2s;
  :hover {
    box-shadow: 0 0 4px ${Color.primaryColor} };
}
`;

// 原理 通过拖动draggable-line，计算偏移量
const DraggableLayout: FC<{
  firstNode: ReactNode;
  secondNode: ReactNode;
  direction: Direction;
  limitRange?: [number, number];
}> = (props) => {
  const {
    firstNode,
    secondNode,
    direction = 'horizontal',
    limitRange: [min = 30, max = 70] = [30, 70],
  } = props;

  const draggableLineRef = useRef(null);
  const draggableLayoutRef = useRef(null);
  const firstRef = useRef(null);
  const secondRef = useRef(null);

  const styleMap = {
    horizontal: {
      firstStyle: {
        width: `calc(${min}% - 5px)`,
      },
      secondStyle: {
        width: `calc(${100 - min}% - 5px)`,
      },
    },
    vertical: {
      firstStyle: {
        height: `calc(${100 - min}% - 5px)`,
      },
      secondStyle: {
        height: `calc(${min}% - 5px)`,
      },
    },
  };

  const drag = () => {
    const draggableDom: any = draggableLineRef.current;
    const contentDom: any = draggableLayoutRef.current;
    const firstDom: any = firstRef.current;
    const secondDom: any = secondRef.current;
    draggableDom.onmousedown = (e: any) => {
      // 设置好方向 可通过变量控制默认水平方向 horizontal | vertical
      const startCoordinate = direction === 'horizontal' ? e.clientX : e.clientY; // 获取第一次点击的横坐标
      const secondDomStartSize =
        direction === 'horizontal' ? secondDom.offsetWidth : secondDom.offsetHeight; // 获取到元素的宽度

      // 移动过程中对两元素宽度计算赋值
      document.onmousemove = (_e: any) => {
        if (direction === 'horizontal') {
          const moveOffset: number = _e.clientX - startCoordinate;
          const firstPercentage =
            ((contentDom.offsetWidth - 15 - secondDomStartSize + moveOffset) /
              (contentDom.offsetWidth - 10)) *
            100;
          const secondPercentage =
            ((secondDomStartSize - moveOffset + 5) / (contentDom.offsetWidth - 10)) * 100;
          firstDom.style.width = `calc(${Math.max(firstPercentage, min)}% - 5px)`;
          secondDom.style.width = `calc(${Math.max(secondPercentage, 100 - max)}% - 5px)`;
        } else {
          const moveOffset = _e.clientY - startCoordinate;
          const firstPercentage =
            ((contentDom.offsetHeight - 15 - secondDomStartSize + moveOffset) /
              (contentDom.offsetHeight - 10)) *
            100;
          const secondPercentage =
            ((secondDomStartSize - moveOffset + 5) / (contentDom.offsetHeight - 10)) * 100;
          firstDom.style.height = `calc(${firstPercentage}% - 5px)`;
          secondDom.style.height = `calc(${secondPercentage}% - 5px)`;
        }
      };
      // 在左侧和右侧元素父容器上绑定松开鼠标解绑拖拽事件
      contentDom.onmouseup = () => {
        document.onmousemove = null;
      };
      return false;
    };
  };

  useEffect(() => drag(), []);

  return (
    <div
      ref={draggableLayoutRef}
      className={'draggable-layout'}
      style={{ display: direction === 'horizontal' ? 'flex' : 'block', height: '100%' }}
    >
      <div ref={firstRef} style={styleMap[direction].firstStyle}>
        {firstNode}
      </div>

      <div
        ref={draggableLineRef}
        css={css`
          cursor: ${direction === 'horizontal' ? 'ew-resize' : 'ns-resize'};
          padding: ${direction === 'horizontal' ? '0 4px' : '4px 0'};
          z-index: 100;
        `}
      >
        <DividerLine direction={direction} />
      </div>

      <div ref={secondRef} style={styleMap[direction].secondStyle}>
        {secondNode}
      </div>
    </div>
  );
};

export default DraggableLayout;
