import styled from '@emotion/styled';

const SpaceBetweenWrapper = styled.div<{ width?: string }>`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  width: ${(props) => props.width};
  & > * {
    margin-top: 0;
    margin-bottom: 0;
  }
`;

export default SpaceBetweenWrapper;
