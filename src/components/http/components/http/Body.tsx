import { css } from '@emotion/react';
import { Radio, RadioChangeEvent } from 'antd';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import RawBody, { HttpRawBodyRef } from './RawBody';
const HttpBody = () => {
  const { t } = useTranslation();

  const [value, setValue] = useState('application/json');
  const plainOptions = ['application/json'];
  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setValue(value);
  };
  const rawBodyRef = useRef<HttpRawBodyRef>(null);

  return (
    <div
      css={css`
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin: 6px 0;
        `}
      >
        <Radio.Group options={plainOptions} onChange={onChange} value={value} />
        <a onClick={() => rawBodyRef.current?.prettifyRequestBody()}>{t('action.prettify')}</a>
      </div>

      <RawBody ref={rawBodyRef} />
    </div>
  );
};

export default HttpBody;
