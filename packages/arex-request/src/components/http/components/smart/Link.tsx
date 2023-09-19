import { ArrowRightOutlined } from '@ant-design/icons';
import { css, useTheme } from '@emotion/react';
import { Typography } from 'antd';
import React, { FC } from 'react';
const { Text } = Typography;
interface SmartLinkProps {
  href: string;
  children: React.ReactNode;
}
const SmartLink: FC<SmartLinkProps> = ({ href, children }) => {
  const theme = useTheme();
  return (
    <a href={href} target={'_blank'} rel='noreferrer'>
      <Text
        type='secondary'
        underline
        css={css`
          font-size: 12px;
          transition: 0.2s;
          &:hover {
            color: ${theme.colorPrimary};
          }
        `}
      >
        {children}
        <ArrowRightOutlined
          css={css`
            transform: rotate(-45deg);
          `}
        />
      </Text>
    </a>
  );
};

export default SmartLink;
