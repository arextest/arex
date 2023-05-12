import { useRequest } from 'ahooks';
import { App, Form, Switch } from 'antd';
import { ColorPrimaryPalette, getLocalStorage, PanesTitle } from 'arex-core';
import React, { FC, useEffect } from 'react';

import { EMAIL_KEY } from '@/constant';
import { useColorPrimary } from '@/hooks';
import { LoginService } from '@/services';
import { UserProfile } from '@/services/UserService';
import useUserProfile from '@/store/useUserProfile';

import AvatarUpload from './AvatarUpload';
import ColorPicker from './ColorPicker';
import LanguageSelect from './LanguageSelect';
import ThemeSwitch from './ThemeSwitch';

type SettingForm = Omit<UserProfile, 'colorPrimary'> & { colorPrimary: ColorPrimaryPalette };

const SettingPage: FC = () => {
  const { message } = App.useApp();
  const email = getLocalStorage<string>(EMAIL_KEY) as string;
  const colorPrimary = useColorPrimary();
  const { avatar, theme, compact, language, getUserProfile } = useUserProfile();

  const [form] = Form.useForm<SettingForm>();

  useEffect(() => {
    // init form value
    form.setFieldsValue({
      avatar,
      theme,
      compact,
      language,
      colorPrimary,
    });
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      colorPrimary,
    });
  }, [colorPrimary]);

  const handleFormChange = () => {
    form
      .validateFields()
      .then((values) => {
        const profile: UserProfile = {
          colorPrimary: values.colorPrimary.name,
          theme: values.theme,
          compact: values.compact,
          language: values.language,
          avatar: values.avatar,
        };

        getUserProfile();
        updateUserProfileRequestRun({
          profile: JSON.stringify(profile),
          userName: email,
        });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const { run: updateUserProfileRequestRun } = useRequest(LoginService.updateUserProfile, {
    manual: true,
    onError(err) {
      message.error('Update profile failed');
      console.error(err);
    },
  });

  return (
    <Form
      name='setting-form'
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      onValuesChange={handleFormChange}
    >
      <PanesTitle title='User Interface' />

      <Form.Item label='Compact' name='compact' valuePropName='checked'>
        <Switch />
      </Form.Item>

      <Form.Item label='Theme' name='theme'>
        <ThemeSwitch />
      </Form.Item>

      <Form.Item label='Primary Color' name='colorPrimary'>
        <ColorPicker />
      </Form.Item>

      <Form.Item label='Language' name='language'>
        <LanguageSelect />
      </Form.Item>

      <Form.Item label='Avatar' name='avatar'>
        <AvatarUpload />
      </Form.Item>
    </Form>
  );
};

export default SettingPage;
