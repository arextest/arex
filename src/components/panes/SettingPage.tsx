import { useRequest } from 'ahooks';
import { App, Form, Select, Switch } from 'antd';
import { changeLanguage } from 'i18next';
import React, { FC, useEffect } from 'react';

import { EmailKey } from '../../constant';
import { getLocalStorage } from '../../helpers/utils';
import { useColorPrimary } from '../../hooks';
import { local } from '../../i18n';
import { UserService } from '../../services/User.service';
import useUserProfile, { UserProfile } from '../../store/useUserProfile';
import { ColorPrimaryPalette } from '../../theme';
import { AvatarUpload, ColorPicker } from '../setting';
import { PanesTitle } from '../styledComponents';

const { Option } = Select;

type SettingForm = Omit<UserProfile, 'colorPrimary'> & { colorPrimary: ColorPrimaryPalette };

const SettingPage: FC = () => {
  const { message } = App.useApp();
  const email = getLocalStorage<string>(EmailKey);
  const colorPrimary = useColorPrimary();
  const { avatar, darkMode, compactMode, language, setUserProfile } = useUserProfile();

  const [form] = Form.useForm<SettingForm>();

  useEffect(() => {
    // init form value
    form.setFieldsValue({
      avatar,
      darkMode,
      compactMode,
      language,
      colorPrimary,
    });
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      colorPrimary,
    });
  }, [colorPrimary]);

  const handleFormChange = (value: Partial<SettingForm>) => {
    value.language !== undefined && changeLanguage(value.language);

    form
      .validateFields()
      .then((values) => {
        const profile: UserProfile = {
          colorPrimary: values.colorPrimary.name,
          darkMode: values.darkMode,
          compactMode: values.compactMode,
          language: values.language,
          avatar: values.avatar,
        };

        setUserProfile(profile);
        updateUserProfileRequestRun({
          profile: JSON.stringify(profile),
          userName: email,
        });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

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

  return (
    <Form
      name='setting-form'
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      onValuesChange={handleFormChange}
    >
      <PanesTitle title='User Interface' />

      <Form.Item label='Compact Mode' name='compactMode' valuePropName='checked'>
        <Switch />
      </Form.Item>

      <Form.Item label='Dark Mode' name='darkMode' valuePropName='checked'>
        <Switch />
      </Form.Item>

      <Form.Item label='Primary Color' name='colorPrimary'>
        <ColorPicker />
      </Form.Item>

      <Form.Item label='Language' name='language'>
        <Select style={{ width: 120 }}>
          {local.map((lng) => (
            <Option key={lng.key} value={lng.key}>
              {lng.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label='Avatar' name='avatar'>
        <AvatarUpload />
      </Form.Item>
    </Form>
  );
};

export default SettingPage;
