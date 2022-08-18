import { useRequest } from 'ahooks';
import { Anchor, Form, message, Select, Spin, Switch } from 'antd';
import { changeLanguage } from 'i18next';
import { FC, useEffect, useMemo, useState } from 'react';
import { CirclePicker } from 'react-color';

import { local } from '../i18n';
import { UserService } from '../services/UserService';
import { useStore } from '../store';
import { primaryColorPalette, ThemeClassify, ThemeKey } from '../style/theme';
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
  theme: ThemeClassify;
  onChange?: (color: string) => void;
};
const ColorPicker: FC<ColorPickerProps> = ({ value, onChange, theme }) => {
  const colors = useMemo(() => primaryColorPalette[theme].map((color) => color.key), [theme]);

  return (
    <div style={{ padding: '8px 0 0 0' }}>
      <CirclePicker
        width={'320px'}
        circleSize={20}
        color={value}
        colors={colors}
        onChangeComplete={(color) => {
          onChange && onChange(color.hex);
        }}
      />
    </div>
  );
};

const Setting: FC = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [form] = Form.useForm<SettingForm>();
  const {
    userInfo: { email },
    themeClassify,
    setUserInfo,
    changeTheme,
  } = useStore();

  const handleFormChange = (value: Partial<SettingForm>, allValue: SettingForm) => {
    // 设置目标的 ThemeClassify
    const themeMode = allValue.darkMode ? ThemeClassify.dark : ThemeClassify.light;
    // 设置状态更新前的 ThemeClassify
    const oldTheme =
      value.darkMode !== undefined // 当修改的值为 darkMode 时，说明 themeClassify 发生变更，否则沿用原有的 themeClassify
        ? themeMode === ThemeClassify.dark
          ? ThemeClassify.light
          : ThemeClassify.dark
        : themeMode;
    const primaryColorIndex = primaryColorPalette[oldTheme].findIndex(
      (color) => color.key.toLocaleLowerCase() === allValue.primaryColor.toLocaleLowerCase(),
    );
    console.log(primaryColorPalette, allValue, primaryColorIndex, oldTheme);
    const { name: theme, key: primaryColor } = primaryColorPalette[themeMode][primaryColorIndex];

    // 原理上 darkMode 和 primaryColor 都是为了指定设置一个主题
    (value.darkMode !== undefined || value.primaryColor !== undefined) && changeTheme(theme);
    value.language !== undefined && changeLanguage(value.language);

    // value.primaryColor !== undefined && changeTheme(theme, primaryColor);

    form
      .validateFields()
      .then((values) => {
        setLocalStorage(ThemeKey, theme);
        const profile = {
          theme,
          fontSize: values.fontSize,
          language: values.language,
        };
        updateUserProfileRequestRun({
          profile: JSON.stringify(profile),
          userName: email,
        });

        // 此处没有调用 UserService.userProfile 而是采用本地更新的方式
        setUserInfo({
          email,
          profile: {
            theme,
            fontSize: profile.fontSize,
            language: profile.language,
          },
        });
        form.setFieldsValue({
          darkMode: themeMode === ThemeClassify.dark,
          primaryColor,
          fontSize: profile.fontSize,
          language: profile.language,
        });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  useRequest(() => UserService.userProfile(email as string), {
    ready: !!email,
    onSuccess(res) {
      const profile = res.profile;
      const [themeMode] = profile.theme.split('-');
      setUserInfo({
        email,
        profile: {
          theme: profile.theme,
          fontSize: profile.fontSize,
          language: profile.language,
        },
      });
      form.setFieldsValue({
        darkMode: themeMode === ThemeClassify.dark,
        primaryColor: primaryColorPalette[themeMode].find((color) => color.name === profile.theme)
          ?.key,
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
          <Form.Item label='Primary Color' name='primaryColor'>
            <ColorPicker theme={themeClassify} />
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
