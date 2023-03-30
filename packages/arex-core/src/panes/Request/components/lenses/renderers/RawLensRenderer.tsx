import { css } from '@emotion/react';
import React, { FC, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useMonaco } from '../../../../../hooks';
import { HoppRESTResponse } from '../../../helpers/types/HoppRESTResponse';
import { HttpContext } from '../../../index';
const RawLensRenderer: FC<{ response: HoppRESTResponse }> = ({ response }) => {
  const rawResponse = useRef(null);
  const { t } = useTranslation();
  const { store } = useContext(HttpContext);
  useMonaco(rawResponse, response.type === 'success' ? JSON.stringify(response.body) : '', {
    extendedEditorConfig: {
      lineWrapping: true,
      mode: 'txt',
      placeholder: t('request.raw_body').toString(),
      readOnly: true,
      theme: store.theme,
    },
    environmentHighlights: true,
    onChange: (value: string) => {
      console.log();
    },
  });
  return (
    <div
      css={css`
        height: 100%;
      `}
    >
      <div
        css={css`
          height: 100%;
        `}
        ref={rawResponse}
      ></div>
    </div>
  );
};

export default RawLensRenderer;
