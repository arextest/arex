import styled from '@emotion/styled';
import { Divider } from 'antd';
import { FC } from 'react';

import CheckOrCloseIcon from '../styledComponents/CheckOrCloseIcon';

const FooterWrapper = styled.div`
  height: 26px;
  width: 100%;
  line-height: 26px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  z-index: 1000;
  .footer_right {
    margin-right: 12px;
    span {
      color: ${(props) => props.theme.colorTextTertiary};
      margin-left: 6px;
    }
  }
`;

const AppFooter: FC = () => {
  return (
    <div>
      <Divider style={{ margin: 0 }} />
      <FooterWrapper>
        <div className='footer_left'></div>
        <div className='footer_right'>
          <span>
            <CheckOrCloseIcon size={12} checked={window.__AREX_EXTENSION_INSTALLED__} />
            Browser Agent
          </span>
        </div>
      </FooterWrapper>
    </div>
  );
};

export default AppFooter;
