import { css } from '@emotion/react';
import { Flex, Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import React, { FC } from 'react';

export interface TagBlockProps extends Omit<TextProps, 'title'> {
  title: React.ReactNode;
  color?: string;
}

const TagBlock: FC<TagBlockProps> = (props) => {
  const { title, color, className, style, children, ...restProps } = props;
  return (
    <Flex
      align='center'
      className={className}
      style={style}
      css={css`
        margin-right: 16px;
        .color-block {
          display: inline-flex;
          width: 24px;
          height: 12px;
          margin-right: 8px;
          background-color: ${color};
        }
      `}
    >
      <span className='color-block' />
      <Typography.Text type='secondary' {...restProps}>
        {title}
        {children}
      </Typography.Text>
    </Flex>
  );
};

export default TagBlock;
