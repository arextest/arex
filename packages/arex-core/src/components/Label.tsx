import styled from '@emotion/styled';
import { Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';

const Label = styled(Typography.Text)<{ offset?: number & TextProps }>`
  display: inline-block;
  margin-right: ${(props) => (props.offset ? props.offset : 0)}px;
  :after {
    content: ':';
    padding: 0 6px 0 2px;
  }
`;

export default Label;
