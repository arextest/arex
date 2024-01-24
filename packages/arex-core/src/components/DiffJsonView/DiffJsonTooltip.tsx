import { css } from '@emotion/react';
import { Flex, theme as antdTheme, Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

const DiffJsonTooltip: FC<TextProps> = (props) => {
  const { token } = antdTheme.useToken();
  const { t } = useTranslation();

  return (
    <Flex
      css={css`
        .color-tag {
          margin-right: 16px;
        }
        .color-block {
          display: inline-flex;
          width: 24px;
          height: 12px;
          margin-right: 8px;
        }
        .color-block-difference {
          background-color: ${token.colorInfoBgHover};
        }
        .color-block-more {
          background-color: ${token.colorWarningBgHover};
        }
      `}
    >
      <Flex className='color-tag' align='center'>
        <span className='color-block color-block-more' />
        <Typography.Text type='secondary' {...props}>
          {t('moreNode')}
        </Typography.Text>
      </Flex>
      <Flex className='color-tag' align='center'>
        <span className='color-block color-block-difference' />
        <Typography.Text type='secondary' {...props}>
          {t('differenceNode')}
        </Typography.Text>
      </Flex>
    </Flex>
  );
};

export default DiffJsonTooltip;
