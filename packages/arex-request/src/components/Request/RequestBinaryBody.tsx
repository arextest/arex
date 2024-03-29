import { UploadOutlined } from '@ant-design/icons';
import { css } from '@arextest/arex-core';
import { Button, Upload } from 'antd';
import React, { useState } from 'react';

import { useArexRequestStore } from '../../hooks';

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

const RequestBinaryBody = () => {
  const [base64String, setBase64String] = useState('');
  const { dispatch } = useArexRequestStore();
  return (
    <div>
      <Upload
        maxCount={1}
        beforeUpload={(a, s) => {
          toBase64(a).then((r) => {
            setBase64String(r);
            dispatch((state) => {
              state.request.body.body = r;
            });
          });
          return false;
        }}
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
        <div
          css={css`
            width: 500px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          `}
        >
          {base64String}
        </div>
      </Upload>
    </div>
  );
};

export default RequestBinaryBody;
