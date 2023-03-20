import { PlusOutlined } from '@ant-design/icons';
import { App, theme, Upload, UploadFile, UploadProps } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/es/upload';
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

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('Image must smaller than 1Mb!');
    }
    return isJpgOrPng && isLt1M;
  };
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    getBase64(info.file.originFileObj as RcFile, (url) => {
      props.onChange?.(url);
    });
  };

  return (
    <ImgCrop rotate>
      <Upload
        name='avatar'
        listType='picture-card'
        className='avatar-uploader'
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
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
