import styled from '@emotion/styled';
import { ReactNode } from 'react';

export type PanesTitleProps = {
  title: ReactNode;
  extra?: ReactNode;
};
const PanesTitle = styled((props: PanesTitleProps) => {
  const { title, extra, ...extraProps } = props;
  return (
    <div {...extraProps}>
      <h2>{title}</h2>
      {extra && <span>{extra}</span>}
    </div>
  );
})<PanesTitleProps>`
  height: 32px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  h2 {
    margin: 0 auto 0 0;
  }
  & > span > *:not(h2) {
    margin-left: 16px;
  }
`;

export default PanesTitle;
