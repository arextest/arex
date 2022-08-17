import { useRequest } from 'ahooks';
import { Anchor, Form, message, Select, Spin, Switch } from 'antd';
import { changeLanguage } from 'i18next';
import { FC, useEffect, useState } from 'react';
import { CirclePicker } from 'react-color';

import { local } from '../i18n';
import { UserService } from '../services/UserService';
import { useStore } from '../store';
import { Theme, ThemeKey } from '../style/theme';
import { setLocalStorage } from '../utils';
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
  const [initLoading, setInitLoading] = useState(true);
  const [form] = Form.useForm<SettingForm>();
  const {
    userInfo: { email },
    setUserInfo,
    changeTheme,
  } = useStore();

  const handleFormChange = (value: Partial<SettingForm>) => {
    value.darkMode !== undefined && changeTheme();
    value.language !== undefined && changeLanguage(value.language);

    form
      .validateFields()
      .then((values) => {
        const theme = values.darkMode ? Theme.dark : Theme.light;
        setLocalStorage(ThemeKey, theme);
        const profile = {
          theme,
          primaryColor: values.primaryColor,
          fontSize: values.fontSize,
          language: values.language,
        };
        updateUserProfileRequestRun({
          profile: JSON.stringify(profile),
          userName: email,
        });
        getUserProfile();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const { run: getUserProfile } = useRequest(() => UserService.userProfile(email as string), {
    ready: !!email,
    onSuccess(res) {
      const profile = res.profile;
      setUserInfo({
        email,
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
      setInitLoading(false);
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
    <Spin spinning={initLoading}>
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
              {local.map((lng) => (
                <Option key={lng.key} value={lng.key}>
                  {lng.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Spin>
  );
};

export default Setting;
