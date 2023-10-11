import { css, Label, styled } from '@arextest/arex-core';
import { Spin } from 'antd';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { getStatusCodeReasonPhrase } from '../../helpers/utils/statusCodes';
import { ArexRESTResponse } from '../../types';

const StatusText = styled.span<{ type?: 'success' | 'error' }>`
  color: ${(props) =>
    props.type === 'success'
      ? props.theme.colorSuccess
      : props.type === 'error'
      ? props.theme.colorError
      : undefined};
  font-weight: bolder;
  margin-right: 14px;
  margin-left: 4px;
`;

const ResponseMeta: FC<{ response?: ArexRESTResponse }> = ({ response }) => {
  const { t } = useTranslation();

  const type = useMemo(() => {
    if (response?.type === 'fail' || response?.type === 'success') {
      return response?.statusCode >= 400 ? 'error' : 'success';
    } else return undefined;
  }, [response]);

  const readableResponseSize = useMemo(() => {
    if (response?.type === 'success' || response?.type === 'fail') {
      const size = response.meta.responseSize;
      if (size >= 100000) return (size / 1000000).toFixed(2) + ' MB';
      if (size >= 1000) return (size / 1000).toFixed(2) + ' KB';
      return undefined;
    } else {
      return '';
    }
  }, [response]);

  return (
    <div>
      {response?.type === 'loading' && (
        <Spin
          css={css`
            margin: 20px 0;
            padding: 30px 50px;
            text-align: center;
            border-radius: 4px;
            height: 100%;
          `}
        />
      )}

      {response?.type === 'success' && (
        <>
          <span>
            {t('response.status')}:
            <StatusText type={type}>
              {`${response.statusCode}\xA0•\xA0`}
              {getStatusCodeReasonPhrase(response.statusCode)}
            </StatusText>
          </span>

          <span>
            {t('response.time')}:
            <StatusText type={type}>{`${response.meta.responseDuration}ms`}</StatusText>
          </span>

          <span>
            <Label>{t('response.size')}</Label>
            <StatusText type={type}>
              {readableResponseSize || `${response.meta.responseSize} B`}
            </StatusText>
          </span>
        </>
      )}
    </div>
  );
};

export default ResponseMeta;
