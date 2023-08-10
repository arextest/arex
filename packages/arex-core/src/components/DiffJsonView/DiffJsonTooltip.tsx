import { css } from '@emotion/react';
import { theme as antdTheme, Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useArexCoreConfig } from '../../hooks';
import DiffJsonViewWrapper from './DiffJsonViewWrapper';

const DiffJsonTooltip: FC<TextProps> = (props) => {
  const { token } = antdTheme.useToken();
  const { theme } = useArexCoreConfig();
  const { t } = useTranslation();

  return (
    <DiffJsonViewWrapper>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          .color-tag-difference {
            background-color: ${token.colorInfoBgHover};
          }
          .color-tag-more {
            background-color: ${token.colorWarningBgHover};
          }
        `}
      >
        <div
          className={`MsgWithDiffLegend`}
          css={css`
            color: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.85)' : '#333'};
          `}
        >
          <div>
            <div className='color-tag-more' />
            <Typography.Text type='secondary' {...props}>
              {t('moreNode')}
            </Typography.Text>
          </div>
          <div>
            <div className='color-tag-difference' />
            <Typography.Text type='secondary' {...props}>
              {t('differenceNode')}
            </Typography.Text>
          </div>
        </div>
      </div>
    </DiffJsonViewWrapper>
  );
};

export default DiffJsonTooltip;
