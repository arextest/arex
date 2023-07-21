import { styled } from '@arextest/arex-core';

const UndertoneWrapper = styled.div`
  border-radius: ${(props) => props.theme.borderRadius}px;
  background-color: ${(props) => props.theme.colorFillAlter};
  padding: ${(props) => props.theme.paddingSM}px ${(props) => props.theme.paddingMD}px;
`;

export default UndertoneWrapper;
