import styled from '@emotion/styled';

const Label = styled.label<{ offset?: number }>`
  display: inline-block;
  margin-right: ${(props) => (props.offset ? props.offset : 0)}px;
  :after {
    content: ':';
    padding: 0 6px 0 2px;
  }
`;

export default Label;
