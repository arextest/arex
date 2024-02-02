import styled from '@emotion/styled';
import { useHover } from 'ahooks';
import React, { FC, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

const HoveredActionButtonWrapper = styled.div`
  position: relative;
  cursor: pointer;

  .hovered-action-button-unhovered,
  .hovered-action-button-enter,
  .hovered-action-button-exit-done {
    opacity: 0;
  }
  .hovered-action-button-enter-active {
    opacity: 1;
    transition: opacity 250ms;
  }
  .hovered-action-button-exit,
  .hovered-action-button-enter-done {
    opacity: 1;
  }
  .hovered-action-button-exit-active {
    opacity: 0;
    transition: opacity 250ms;
  }
`;

export interface HoveredActionButtonProps {
  hoveredNode?: React.ReactNode;
  children?: React.ReactNode;
  onHover?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const HoveredActionButton: FC<HoveredActionButtonProps> = (props) => {
  const unhoverRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef<HTMLDivElement>(null);
  const hoveredActionButtonRef = useRef<HTMLDivElement>(null);

  const hovered = useHover(hoveredActionButtonRef);

  return (
    <HoveredActionButtonWrapper
      ref={hoveredActionButtonRef}
      className={props.className}
      style={props.style}
    >
      <CSSTransition
        nodeRef={unhoverRef}
        in={!hovered}
        timeout={1000}
        classNames='hovered-action-button'
      >
        <div ref={unhoverRef}>{props.children}</div>
      </CSSTransition>
      <CSSTransition
        nodeRef={hoveredRef}
        in={hovered}
        timeout={1000}
        classNames='hovered-action-button'
      >
        <div
          ref={hoveredRef}
          className='hovered-action-button-unhovered'
          style={{
            position: 'absolute',
            left: '50%',
            top: ' 50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {props.hoveredNode}
        </div>
      </CSSTransition>
    </HoveredActionButtonWrapper>
  );
};

export default HoveredActionButton;
