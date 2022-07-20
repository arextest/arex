import styled from "@emotion/styled";
import { Button, ButtonProps } from "antd";

const SmallTextButton = styled((props: ButtonProps) => (
  <Button type="text" size="small" className={props.className} {...props}>
    {props.title}
  </Button>
))<{ title: string } & ButtonProps>`
  color: ${(props) => props.theme.color.primary}!important;
`;

export default SmallTextButton;
