import { useRequest } from 'ahooks';
import { Form, message, Select, Switch, theme } from 'antd';
import { changeLanguage } from 'i18next';
import React, { FC, useEffect, useMemo } from 'react';
import { CirclePicker } from 'react-color';

import { EmailKey } from '../constant';
import { getLocalStorage } from '../helpers/utils';
import { useColorPrimary } from '../hooks';
import { local } from '../i18n';
import { UserService } from '../services/User.service';
import useUserProfile, { UserProfile } from '../store/useUserProfile';
import { ColorPrimaryPalette, colorPrimaryPalette } from '../theme';

const { Option } = Select;
const { defaultSeed, darkAlgorithm, defaultAlgorithm } = theme;

type SettingForm = Omit<UserProfile, 'colorPrimary'> & { colorPrimary: ColorPrimaryPalette };

// Custom form item component
type ColorPickerProps = {
  value?: ColorPrimaryPalette;
  onChange?: (color: ColorPrimaryPalette) => void;
};
const ColorPicker: FC<ColorPickerProps> = ({ value, onChange }) => {
  const { darkMode } = useUserProfile();

  const colors = useMemo(() => {
    const algorithm = darkMode ? darkAlgorithm : defaultAlgorithm;

    return colorPrimaryPalette.map(
      (color) => algorithm(Object.assign(defaultSeed, { colorPrimary: color.key })).colorPrimary,
    );
  }, [darkMode]);

  return (
    <div style={{ padding: '8px 0 0 0' }}>
      <CirclePicker
        width={'320px'}
        circleSize={20}
        color={value?.key}
        colors={colors}
        onChangeComplete={(color) => {
          const colorIndex = colors.findIndex((c) => c === color.hex);
          onChange?.(colorPrimaryPalette[colorIndex]);
        }}
      />
    </div>
  );
};

const SettingPage: FC = () => {
  const email = getLocalStorage<string>(EmailKey);
  const { darkMode, compactMode, language, setUserProfile } = useUserProfile();
  const colorPrimary = useColorPrimary();

  const [form] = Form.useForm<SettingForm>();

  useEffect(() => {
    // init form value
    form.setFieldsValue({
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
      name='form'
      form={form}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      onValuesChange={handleFormChange}
    >
      <h2 id='user-interface'>User Interface</h2>

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
    </Form>
  );
};

export default SettingPage;
