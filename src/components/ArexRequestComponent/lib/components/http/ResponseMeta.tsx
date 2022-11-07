import { css } from '@emotion/react';
import { Empty, Spin, Typography } from 'antd';
import { FC, useContext, useMemo } from 'react';

import { HoppRESTResponse } from '../../helpers/types/HoppRESTResponse';
import { getStatusCodeReasonPhrase } from '../../helpers/utils/statusCodes';
import { getValueByPath } from '../../helpers/utils/locale';
import { GlobalContext, HttpContext } from '../../index';

const HttpResponseMeta: FC<{ response: HoppRESTResponse }> = ({ response }) => {
  const { store } = useContext(HttpContext);
  const { store: globalStore } = useContext(GlobalContext);

  const t = (key) => getValueByPath(globalStore.locale.locale, key);
  const tabCss = css`
    color: #10b981;
    font-weight: bolder;
    margin-right: 14px;
    margin-left: 4px;
  `;

  const readableResponseSize = useMemo(() => {
    const size = response.meta.responseSize;
    if (size >= 100000) return (size / 1000000).toFixed(2) + ' MB';
    if (size >= 1000) return (size / 1000).toFixed(2) + ' KB';

    return undefined;
  }, [response]);

  return (
    <div
      css={css`
        padding: 16px 0 16px 0;
      `}
    >
      {response.type === 'null' ? (
        <div>
          <Empty
            description={
              <Typography.Text type='secondary'>
                Enter the URL and click Send to get a response
              </Typography.Text>
            }
          />
        </div>
      ) : (
        <>
          <div>
            {response.type === 'loading' ? (
              <div
                css={css`
                  margin: 20px 0;
                  margin-bottom: 20px;
                  padding: 30px 50px;
                  text-align: center;
                  border-radius: 4px;
                  height: 100%;
                `}
              >
                <Spin />
              </div>
            ) : null}
          </div>

          <div>
            {response.type === 'success' ? (
              <div>
                <span>
                  {t('response.status')}:
                  <span css={tabCss}>
                    {`${response.statusCode}\xA0 • \xA0`}
                    {getStatusCodeReasonPhrase(response.statusCode)}
                  </span>
                </span>
                <span>
                  {t('response.time')}:
                  <span css={tabCss}>{`${response.meta.responseDuration}ms`}</span>
                </span>
                <span>
                  {t('response.size')}:
                  <span css={tabCss}>
                    {readableResponseSize || `${response.meta.responseSize} B`}
                  </span>
                </span>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default HttpResponseMeta;
