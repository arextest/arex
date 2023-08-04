import { Select } from 'antd';
import React, { FC } from 'react';

export type DataMaskingNodeConfigProps = {
  onChange?: (value: string) => void;
};

const DataMaskingNodeConfig: FC<DataMaskingNodeConfigProps> = (props) => {
  return (
    <>
      <div>node data masking config</div>
      <Select
        defaultValue={'md5'}
        options={[
          { label: 'MD5加解密', value: 'md5' },
          { label: 'SHA1加解密', value: 'sha1' },
        ]}
        onChange={props.onChange}
        style={{ width: '200px' }}
      />
    </>
  );
};

export default DataMaskingNodeConfig;
