import { Button, ButtonProps, Tooltip, TooltipProps } from 'antd';
import { Breakpoint } from 'antd/es/_util/responsiveObserver';
// import { Breakpoint } from 'antd/es/_util/responsiveObserve';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import React, { FC } from 'react';

const TooltipButton: FC<
  ButtonProps & Pick<TooltipProps, 'title' | 'placement'> & { breakpoint?: Breakpoint }
> = (props) => {
  const { title, placement, ...restProps } = props;
  const breakpoint = useBreakpoint();

  return props.breakpoint && breakpoint[props.breakpoint] ? (
    <Button type='text' size='small' {...restProps}>
      {title}
    </Button>
  ) : (
    <Tooltip title={title} placement={placement}>
      <Button type='text' size='small' {...restProps} />
    </Tooltip>
  );
};

export default TooltipButton;
