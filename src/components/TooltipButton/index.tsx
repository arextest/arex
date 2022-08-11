import { Button, ButtonProps, Tooltip, TooltipProps } from 'antd';
import { FC } from 'react';

const TooltipButton: FC<ButtonProps & Pick<TooltipProps, 'title' | 'placement'>> = (props) => {
  const { title, placement, ...restProps } = props;
  return (
    <Tooltip title={title} placement={placement}>
      <Button type='text' size='small' {...restProps} />
    </Tooltip>
  );
};

export default TooltipButton;
