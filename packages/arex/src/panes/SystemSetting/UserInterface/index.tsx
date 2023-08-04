import { ColorPrimaryPalette, getLocalStorage, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Form, Switch } from 'antd';
import React, { useEffect } from 'react';

import { EMAIL_KEY } from '@/constant';
import { useColorPrimary } from '@/hooks';
import { LoginService } from '@/services';
import { UserProfile } from '@/services/UserService';
import { useUserProfile } from '@/store';

import AvatarUpload from './AvatarUpload';
import ColorPicker from './ColorPicker';
import LanguageSelect from './LanguageSelect';
import ThemeSwitch from './ThemeSwitch';

type SettingForm = Omit<UserProfile, 'colorPrimary'> & { colorPrimary: ColorPrimaryPalette };

const UserInterface = () => {
  const { message } = App.useApp();
  const email = getLocalStorage<string>(EMAIL_KEY) as string;
  const { t } = useTranslation(['components']);
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
    });
  }, [avatar, compact, language, theme]);

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
    onSuccess(success) {
      success && getUserProfile();
    },
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
      <Form.Item label={t('userSetting.compactMode')} name='compact' valuePropName='checked'>
        <Switch />
      </Form.Item>

      <Form.Item label={t('userSetting.darkMode')} name='theme'>
        <ThemeSwitch />
      </Form.Item>

      <Form.Item label={t('userSetting.primaryColor')} name='colorPrimary'>
        <ColorPicker />
      </Form.Item>

      <Form.Item label={t('userSetting.language')} name='language'>
        <LanguageSelect />
      </Form.Item>

      <Form.Item label={t('userSetting.avatar')} name='avatar'>
        <AvatarUpload />
      </Form.Item>
    </Form>
  );
};

export default UserInterface;
