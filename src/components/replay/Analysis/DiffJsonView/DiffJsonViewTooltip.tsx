import { css, useTheme } from '@emotion/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useUserProfile from '../../../../store/useUserProfile';

const DiffJsonViewTooltip = () => {
  const { t } = useTranslation(['components']);
  const emotionTheme = useTheme();
  const { theme } = useUserProfile();

  return (
    <div
      css={css`
        display: flex;
        justify-content: space-between;
        .color-tag-pink {
          background-color: ${emotionTheme.colorInfoBgHover};
        }
        .color-tag-green {
          background-color: ${emotionTheme.colorWarningBgHover};
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
          <div className='color-tag-green' />
          <span>{t('replay.moreNode')}</span>
        </div>
        <div>
          <div className='color-tag-pink' />
          <span>{t('replay.differenceNode')}</span>
        </div>
        <div>
          <div className='color-tag-grey' />
          <span>{t('replay.ignoreNode')}</span>
        </div>
      </div>
    </div>
  );
};

export default DiffJsonViewTooltip;
