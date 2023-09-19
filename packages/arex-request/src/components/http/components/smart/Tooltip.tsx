import { css } from '@emotion/react';
import { FC, useEffect, useRef, useState } from 'react';

import { Portal } from './Portal';
interface TooltipProps {
  content: any;
  open: boolean;
  left: number;
  top: number;
  contentHeight: number;
}
const SmartTooltip: FC<TooltipProps> = ({ content, open, left, top, contentHeight }) => {
  const listHeight = useRef(null);
  const [maskOpen, setMaskOpen] = useState(false);
  function destroyMask() {
    // console.log('销毁');
  }
  // 组件被销毁的同时销毁容器
  useEffect(() => {
    return () => {
      destroyMask();
    };
  }, []);
  return (
    <Portal>
      <div
        css={css`
          .tooltip-theme1 {
            display: flex;
            padding: 10px;
            border-radius: 3px;
            background-color: #f5f5f5;
          }

          .tooltip-theme1 .name {
            color: black;
            margin-right: 8px;
          }

          .tooltip-theme1 .value {
            color: black;
            background-color: #a3a3a3;
            padding: 0 4px;
            border-radius: 2px;
          }

          .rhi-tooltip {
            position: absolute;
            top: -32px;
            color: black;
            z-index: 1000;
            white-space: nowrap;
            font-weight: bold;
          }

          .rhi-tooltip .content {
            border-radius: 2px;
            padding: 6px;
            background-color: rgb(245, 245, 245);
            box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12),
              0 5px 12px 4px rgba(0, 0, 0, 0.09);
          }

          .rhi-tooltip .shim {
            height: 6px;
          }

          .rhi-tooltip .small-triangle {
            border: 4px solid rgba(0, 0, 0, 0);
            width: 0;
            height: 0;
            border-top-color: rgb(245, 245, 245);
            margin-left: 8px;
          }

          display: ${open || maskOpen ? 'block' : 'none'};
          left: ${left}px;
          top: ${top - contentHeight}px;
          position: absolute;
          font-size: 14px;
        `}
        onFocus={() => {
          setMaskOpen(true);
        }}
        onBlur={() => {
          setMaskOpen(false);
        }}
        onMouseOut={() => {
          setMaskOpen(false);
        }}
        onMouseOver={() => {
          setMaskOpen(true);
        }}
        ref={listHeight}
      >
        {content}
      </div>
    </Portal>
  );
};

export default SmartTooltip;
