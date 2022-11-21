import { useRequest } from 'ahooks';
import { Form, message, Select, Spin, Switch } from 'antd';
import { changeLanguage } from 'i18next';
import { FC, useMemo, useState } from 'react';
import { CirclePicker } from 'react-color';

import DefaultConfig from '../defaultConfig';
import { I18nextLng, local } from '../i18n';
import { UserService } from '../services/UserService';
import { useStore } from '../store';
import { primaryColorPalette, ThemeClassify, themeMap, ThemeName } from '../style/theme';
const { Option } = Select;

export type FontSize = 'small' | 'medium' | 'large';

type SettingForm = {
  darkMode: boolean;
  primaryColor: string;
  fontSize: FontSize;
  language: I18nextLng;
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

const SettingPage: FC = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [form] = Form.useForm<SettingForm>();
  const {
    userInfo: { email },
    themeClassify,
    setUserInfo,
    changeTheme,
  } = useStore();

  const changeFontSize = (fontSize: FontSize) => {
    // @ts-ignore
    // document.body.style['zoom'] = FontSizeMap[fontSize]; // Non-standard: https://developer.mozilla.org/en-US/docs/Web/CSS/zoom
  };

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
    const { name: theme, key: primaryColor } = primaryColorPalette[themeMode][
      primaryColorIndex
    ] || { name: DefaultConfig.theme, key: DefaultConfig.themePrimaryColor };

    // 原理上 darkMode 和 primaryColor 都是为了指定设置一个主题
    (value.darkMode !== undefined || value.primaryColor !== undefined) && changeTheme(theme);
    value.language !== undefined && changeLanguage(value.language);
    value.fontSize !== undefined && changeFontSize(value.fontSize);

    form
      .validateFields()
      .then((values) => {
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

      let themeName: ThemeName = profile.theme || DefaultConfig.theme;
      const validTheme = themeName in themeMap;
      !validTheme && (themeName = DefaultConfig.theme);
      const [themeMode] = themeName.split('-');

      const fontSize = profile.fontSize || DefaultConfig.fontSize;
      const language = profile.language || DefaultConfig.language;

      // set userInfo to global store
      setUserInfo({
        email,
        profile: {
          theme: themeName,
          fontSize,
          language,
        },
      });

      // init form value
      form.setFieldsValue({
        darkMode: themeMode === ThemeClassify.dark,
        primaryColor: primaryColorPalette[themeMode].find(
          (color) => color.name === (validTheme ? profile.theme : DefaultConfig.theme),
        )?.key,
        fontSize,
        language,
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

  return (
    <Spin spinning={initLoading}>
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
            <Select style={{ width: 120 }} disabled>
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

export default SettingPage;
