import {
  ColorPrimaryPalette,
  getLocalStorage,
  I18_KEY,
  setLocalStorage,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Divider, Form, FormProps, Switch } from 'antd';
import React, { useEffect } from 'react';

import { COMPACT_KEY, EMAIL_KEY, PRIMARY_COLOR_KEY, THEME_KEY } from '@/constant';
import { useColorPrimary } from '@/hooks';
import ThemeSegmented from '@/panes/SystemSetting/UserInterface/ThemeSegmented';
import { LoginService } from '@/services';
import { UserProfile } from '@/services/UserService';
import { useUserProfile } from '@/store';

import ColorPicker from './ColorPicker';
import CompactSegmented from './CompactSegmented';
import LanguageSelect from './LanguageSelect';

type UserInterfaceForm = Omit<UserProfile, 'colorPrimary' | 'avatar'> & {
  colorPrimary: ColorPrimaryPalette;
};

const UserInterface = () => {
  const { message } = App.useApp();
  const email = getLocalStorage<string>(EMAIL_KEY) as string;
  const { t } = useTranslation(['components']);
  const colorPrimary = useColorPrimary();
  const { avatar, theme, compact, language, zen, setZen, getUserProfile } = useUserProfile();

  const [form] = Form.useForm<UserInterfaceForm>();

  useEffect(() => {
    // init form value
    form.setFieldsValue({
      theme,
      compact,
      language,
      zen,
    });
  }, [avatar, compact, language, theme, zen]);

  useEffect(() => {
    form.setFieldsValue({
      colorPrimary,
    });
  }, [colorPrimary]);

  const handleFormChange: FormProps['onValuesChange'] = (values) => {
    form
      .validateFields()
      .then((values) => {
        const profile: UserProfile = {
          colorPrimary: values.colorPrimary.name,
          theme: values.theme,
          compact: values.compact,
          language: values.language,
        };

        updateUserProfileRequestRun({
          profile: JSON.stringify(profile),
          userName: email,
        });
      })
      .then(() => {
        // sync local storage
        const key = Object.keys(values)[0];
        const value = values[key];
        switch (key) {
          case 'theme': {
            setLocalStorage(THEME_KEY, value);
            break;
          }
          case 'compact': {
            setLocalStorage(COMPACT_KEY, value);
            break;
          }
          case 'colorPrimary': {
            setLocalStorage(PRIMARY_COLOR_KEY, value.name);
            break;
          }
          case 'language': {
            setLocalStorage(I18_KEY, value);
            break;
          }
        }
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
    <>
      <Divider orientation='left'>{t('systemSetting.userInterface')} </Divider>

      <Form
        name='user-interface-form'
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onValuesChange={handleFormChange}
      >
        <Form.Item label={t('systemSetting.compact')} name='compact'>
          <CompactSegmented />
        </Form.Item>

        <Form.Item label={t('systemSetting.theme.theme')} name='theme'>
          <ThemeSegmented />
        </Form.Item>

        <Form.Item label={t('systemSetting.primaryColor')} name='colorPrimary'>
          <ColorPicker />
        </Form.Item>

        <Form.Item label={t('systemSetting.language')} name='language'>
          <LanguageSelect />
        </Form.Item>

        <Form.Item label={t('systemSetting.zen')} name={'zen'} valuePropName='checked'>
          <Switch size='small' onChange={setZen} />
        </Form.Item>
      </Form>
    </>
  );
};

export default UserInterface;
