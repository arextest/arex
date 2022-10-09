import styled from '@emotion/styled';

const SpaceBetweenWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  & > * {
    margin-top: 0;
    margin-bottom: 0;
  }
`;

export default SpaceBetweenWrapper;
