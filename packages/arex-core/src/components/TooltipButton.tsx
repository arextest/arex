import { Button, ButtonProps, theme, Tooltip, TooltipProps, Typography } from 'antd';
import { Breakpoint } from 'antd/es/_util/responsiveObserver';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { TextProps } from 'antd/es/typography/Text';
import React, { FC, ReactNode, useMemo } from 'react';

export interface TooltipButtonProps extends Omit<ButtonProps, 'title'> {
  title?: ReactNode;
  placement?: TooltipProps['placement'];
  tooltipProps?: TooltipProps;
  textProps?: TextProps;
  breakpoint?: Breakpoint;
  color?: 'primary' | 'text' | 'secondary' | 'disabled' | string;
}

const TooltipButton: FC<TooltipButtonProps> = (props) => {
  const { title, placement, tooltipProps, textProps, style, ...restProps } = props;
  const breakpoint = useBreakpoint();

  const { token } = theme.useToken();
  const colorMap = useMemo<{ [color: string]: string }>(
    () => ({
      primary: token.colorPrimary,
      text: token.colorText,
      secondary: token.colorTextSecondary,
      disabled: token.colorTextDisabled,
      error: token.colorError,
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
      <Typography.Text
        {...textProps}
        style={{ color: props.color && colorMap[props.color], ...style }}
      >
        {title}
      </Typography.Text>
    </Button>
  ) : (
    <Tooltip title={title} placement={placement} {...tooltipProps}>
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
