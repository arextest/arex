import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { FC, ReactNode, useEffect, useRef } from 'react';

// import { Color } from '../style/theme';

type Direction = 'horizontal' | 'vertical';

const DividerLine = styled.div<{ direction: Direction }>`
  width: ${(props) => (props.direction === 'vertical' ? '100%' : '1px')};
  height: ${(props) => (props.direction === 'vertical' ? '1px' : '100%')};
  background-color: ${(props) => props.theme.color.border.primary};
  transition: box-shadow 0.2s;
}
`;

// 原理 通过拖动draggable-line，计算偏移量
const DraggableLayout: FC<{
  firstNode: ReactNode;
  secondNode: ReactNode;
  direction: Direction;
  limitRange?: [number, number];
  lineWidth?: number;
}> = (props) => {
  const {
    firstNode,
    secondNode,
    direction = 'horizontal',
    limitRange: [min = 30, max = 70] = [30, 70],
    lineWidth = 10,
  } = props;

  const draggableLineRef = useRef(null);
  const draggableLayoutRef = useRef(null);
  const firstRef = useRef(null);
  const secondRef = useRef(null);

  const styleMap = {
    horizontal: {
      firstStyle: {
        width: `calc(${(max + min) / 2}% - ${lineWidth}px)`,
        height: '100%',
      },
      secondStyle: {
        width: `calc(${100 - (max + min) / 2}% - ${lineWidth}px)`,
        height: '100%',
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
      const fDomStartSize =
        direction === 'horizontal' ? firstDom.offsetWidth : firstDom.offsetHeight; // 获取到元素的宽度
      // 移动过程中对两元素宽度计算赋值
      document.onmousemove = (_e: any) => {
        if (direction === 'horizontal') {
          const moveOffset: number = _e.clientX - startCoordinate;
          const firstPercentage =
            ((fDomStartSize + moveOffset) / (contentDom.offsetWidth - 2 * lineWidth)) * 100;
          const firstPercentageComputed: any = (function () {
            if (firstPercentage > min && firstPercentage < max) {
              return firstPercentage;
            }
            if (firstPercentage <= min) {
              return min;
            }
            if (firstPercentage >= max) {
              return max;
            }
          })();
          // firstPercentageComputed 是减去之后的百分比
          firstDom.style.width = `${
            ((contentDom.offsetWidth - 2 * lineWidth) * firstPercentageComputed) / 100
          }px`;
          secondDom.style.width = `${
            ((contentDom.offsetWidth - 2 * lineWidth) * (100 - firstPercentageComputed)) / 100
          }px`;
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
      style={{ display: direction === 'horizontal' ? 'flex' : 'block', height: '100%' }}
    >
      <div ref={firstRef} style={styleMap[direction].firstStyle}>
        <div
          css={css`
            width: calc(100% + ${lineWidth}px);
            height: 100%;
          `}
        >
          {firstNode}
        </div>
      </div>

      <div
        ref={draggableLineRef}
        css={css`
          cursor: ${direction === 'horizontal' ? 'ew-resize' : 'ns-resize'};
          padding: ${direction === 'horizontal' ? `0 ${lineWidth}px` : `${lineWidth}px 0`};
          z-index: 100;
          //background-color: salmon;
        `}
      >
        <DividerLine direction={direction} />
      </div>

      <div ref={secondRef} style={styleMap[direction].secondStyle}>
        <div
          css={css`
            width: calc(100% + ${lineWidth}px);
            transform: translateX(-${lineWidth}px);
          `}
        >
          {secondNode}
        </div>
      </div>
    </div>
  );
};

export default DraggableLayout;
