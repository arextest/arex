import { Button, ButtonProps } from "antd";
import { FC } from "react";

import { Color } from "../style/theme";

const SmallTextButton: FC<{ title: string } & ButtonProps> = ({
  title,
  ...buttonProps
}) => {
  return (
    <Button
      type="text"
      size="small"
      style={{ color: Color.primaryColor }}
      {...buttonProps}
    >
      {title}
    </Button>
  );
};

export default SmallTextButton;
