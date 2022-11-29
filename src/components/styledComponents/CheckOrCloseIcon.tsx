import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";

const CheckOrCloseIcon = styled((props: { checked: boolean }) =>
  props.checked ? (
    <CheckCircleOutlined {...props} />
  ) : (
    <CloseCircleOutlined {...props} />
  )
)<{ size?: number; checked: boolean }>`
  font-size: ${(props) => props.size + "px" || "24px"};
  // color: ${(props) =>
    props.checked ? props.theme.color.success : props.theme.color.error};
  margin-right: 8px;
`;

export default CheckOrCloseIcon;
