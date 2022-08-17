import { useRequest } from 'ahooks';
import { Anchor, Form, message, Select, Switch } from 'antd';
import { FC, useEffect, useState } from 'react';
import { CirclePicker } from 'react-color';

import { UserService } from '../services/UserService';
import { useStore } from '../store';
import { Theme } from '../style/theme';
const { Option } = Select;
const { Link } = Anchor;

type SettingForm = {
  darkMode: boolean;
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  language: 'zh-CN' | 'en-US';
};

// Custom form item component
type ColorPickerProps = {
  value?: string;
  onChange?: (color: string) => void;
};
const ColorPicker: FC<ColorPickerProps> = ({ value, onChange }) => (
  <div style={{ padding: '8px 0 0 0' }}>
    <CirclePicker
      width={'320px'}
      circleSize={20}
      color={value}
      onChangeComplete={(color) => {
        onChange && onChange(color.hex);
      }}
    />
  </div>
);

const Setting: FC = () => {
  const [form] = Form.useForm<SettingForm>();
  const setUserInfo = useStore((state) => state.setUserInfo);

  const handleFormChange = () => {
    form
      .validateFields()
      .then((values) => {
        console.log(values);
        const profile = {
          theme: values.darkMode ? Theme.dark : Theme.light,
          primaryColor: values.primaryColor,
          fontSize: values.fontSize,
          language: values.language,
        };
        updateUserProfileRequestRun({
          profile: JSON.stringify(profile),
          userName: localStorage.getItem('email'),
        });
        getUserProfile();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const { run: getUserProfile } = useRequest(() => UserService.userProfile(), {
    onSuccess(res) {
      const profile = res.profile;
      setUserInfo({
        email: localStorage.getItem('email'),
        profile: {
          theme: profile.theme,
          primaryColor: profile.primaryColor,
          fontSize: profile.fontSize,
          language: profile.language,
        },
      });
      form.setFieldsValue({
        darkMode: profile.theme === Theme.dark,
        primaryColor: profile.primaryColor,
        fontSize: profile.fontSize,
        language: profile.language,
      });
    },
  });

  const { run: updateUserProfileRequestRun } = useRequest(
    (params) => UserService.updateUserProfile(params),
    {
      manual: true,
      onError(err) {
        message.error('Update profile failed');
        console.error(err);
      },
    },
  );

  const [targetOffset, setTargetOffset] = useState<number | undefined>(undefined);

  useEffect(() => {
    setTargetOffset(window.innerHeight / 2);
  }, []);

  return (
    <>
      {/* TODO DEBUG */}
      <Anchor targetOffset={targetOffset} style={{ position: 'absolute', right: '40px' }}>
        <Link href='#user-interface' title='User Interface'>
          <Link href='#dark-mode' title='Dark Mode' />
          <Link href='#primary-color' title='Primary Color' />
          <Link href='#font-size' title='Font Size' />
          <Link href='#language' title='Language' />
        </Link>
      </Anchor>

      <Form
        name='form'
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onValuesChange={handleFormChange}
      >
        <h2 id='user-interface'>User Interface</h2>

        <div id='dark-mode'>
          <Form.Item label='Dark Mode' name='darkMode' valuePropName='checked'>
            <Switch />
          </Form.Item>
        </div>

        <div id='primary-color'>
          <Form.Item label='Primary Colorr' name='primaryColor'>
            <ColorPicker />
          </Form.Item>
        </div>

        <div id='font-size'>
          <Form.Item label='Font size' name='fontSize'>
            <Select style={{ width: 120 }}>
              <Option value='small'>Small</Option>
              <Option value='medium'>Medium</Option>
              <Option value='large'>Large</Option>
            </Select>
          </Form.Item>
        </div>

        <div id='language'>
          <Form.Item label='Language' name='language'>
            <Select style={{ width: 120 }}>
              <Option value='en-US'>English</Option>
              <Option value='zh-CN'>简体中文</Option>
            </Select>
          </Form.Item>
        </div>
      </Form>
    </>
  );
};
export default Setting;
