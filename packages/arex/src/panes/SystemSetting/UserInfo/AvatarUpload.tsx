import { PlusOutlined } from '@ant-design/icons';
import { App, theme, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import ImgCrop from 'antd-img-crop';
import React, { FC } from 'react';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const AvatarUpload: FC<{ value?: string; onChange?: (value: string) => void }> = (props) => {
  const { token } = theme.useToken();
  const { message } = App.useApp();

  const handleUpload = (file: RcFile) => {
    const isLegalSuffix = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
    if (!isLegalSuffix) {
      return message.error('You can only upload JPG/PNG file!');
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      return message.error('Image must smaller than 1Mb!');
    }
    getBase64(file, (url) => {
      props.onChange?.(url);
    });
  };

  return (
    <ImgCrop showGrid quality={0.8} onModalOk={(file) => handleUpload(file as RcFile)}>
      <Upload
        name='avatar'
        listType='picture-card'
        className='avatar-uploader'
        showUploadList={false}
        customRequest={() => {}}
      >
        {props.value ? (
          <img
            src={props.value}
            alt='avatar'
            style={{ width: '100%', borderRadius: token.borderRadius }}
          />
        ) : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
    </ImgCrop>
  );
};
export default AvatarUpload;
