import styled from '@emotion/styled';
import { Form, FormProps, Spin } from 'antd';
import { ReactNode } from 'react';

type SettingFormProps = FormProps & { loading: boolean; children: ReactNode };

/**
 * Please use this component for all Forms in the Setting directory
 */
const SettingForm = styled((props: SettingFormProps) => {
  const { loading, ...restProps } = props;
  return loading ? (
    <Spin />
  ) : (
    <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} {...restProps}>
      {props.children}
    </Form>
  );
})`
  .ant-form-item-label > label {
    white-space: break-spaces;
  }
  .ant-checkbox-group {
  }
  .time-classes {
    label.ant-checkbox-wrapper {
      width: 220px;
      margin-right: 16px;
    }
  }
`;

export default SettingForm;
