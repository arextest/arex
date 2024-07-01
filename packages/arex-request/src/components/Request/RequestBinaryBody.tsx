import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import React from 'react';

import { useArexRequestStore } from '../../hooks';

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

const RequestBinaryBody = () => {
  const { dispatch } = useArexRequestStore();
  return (
    <div>
      <Upload
        maxCount={1}
        beforeUpload={(a, s) => {
          toBase64(a).then((r) => {
            dispatch((state) => {
              state.request.body.body = r;
            });
          });
          return false;
        }}
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
    </div>
  );
};

export default RequestBinaryBody;
