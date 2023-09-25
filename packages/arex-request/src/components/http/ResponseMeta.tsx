import { css, Label, styled } from '@arextest/arex-core';
import { Empty, Spin, Typography } from 'antd';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { getStatusCodeReasonPhrase } from '../../helpers/utils/statusCodes';
import { ArexRESTResponse } from '../../types';

const StatusText = styled.span<{ type?: 'success' | 'error' }>`
  color: ${(props) =>
    props.type === 'success' ? props.theme.colorSuccess : props.theme.colorError};
  font-weight: bolder;
  margin-right: 14px;
  margin-left: 4px;
`;

const HttpResponseMeta: FC<{ response?: ArexRESTResponse }> = ({ response }) => {
  const { t } = useTranslation();

  const type = useMemo(() => (response?.statusCode >= 400 ? 'error' : 'success'), [response]);

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
    <>
      {response ? (
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
      ) : (
        <Empty
          description={
            <Typography.Text type='secondary'>
              Enter the URL and click Send to get a response
            </Typography.Text>
          }
        />
      )}
    </>
  );
};

export default HttpResponseMeta;
