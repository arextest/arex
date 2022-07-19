import styled from "@emotion/styled";
import { Button, ButtonProps } from "antd";

const SmallTextButton = styled((props: ButtonProps) => (
  <Button type="text" size="small">
    {props.title}
  </Button>
))<{ title: string } & ButtonProps>`
  color: ${(props) => props.theme.color.primary};
`;

export default SmallTextButton;
