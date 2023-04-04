import { Button, ButtonProps, theme, Tooltip, TooltipProps } from 'antd';
import { Breakpoint } from 'antd/es/_util/responsiveObserver';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import React, { FC, useMemo } from 'react';

const TooltipButton: FC<
  ButtonProps &
    Pick<TooltipProps, 'title' | 'placement'> & {
      breakpoint?: Breakpoint;
      color?: 'primary' | 'text' | 'secondary' | 'disabled' | string;
    }
> = (props) => {
  const { title, placement, style, ...restProps } = props;
  const breakpoint = useBreakpoint();

  const { token } = theme.useToken();
  const colorMap = useMemo<{ [color: string]: string }>(
    () => ({
      primary: token.colorPrimary,
      text: token.colorText,
      secondary: token.colorTextSecondary,
      disabled: token.colorTextDisabled,
    }),
    [token],
  );

  return props.breakpoint && breakpoint[props.breakpoint] ? (
    <Button
      type='text'
      size='small'
      style={{ color: props.color && colorMap[props.color], ...style }}
      {...restProps}
    >
      {title}
    </Button>
  ) : (
    <Tooltip title={title} placement={placement}>
      <Button
        type='text'
        size='small'
        style={{ color: props.color && colorMap[props.color], ...style }}
        {...restProps}
      />
    </Tooltip>
  );
};

export default TooltipButton;
