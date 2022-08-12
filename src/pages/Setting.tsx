import { useRequest } from 'ahooks';
import { Anchor, Form, message, Select, Switch } from 'antd';
import { FC, useEffect, useState } from 'react';
import { CirclePicker } from 'react-color';

import { UserService } from '../services/UserService';
import { useStore } from '../store';
const { Option } = Select;
const { Link } = Anchor;

const Setting: FC = () => {
  const [color, setColor] = useState<string>();
  const [form] = Form.useForm();
  const setUserInfo = useStore((state) => state.setUserInfo);

  function handleOk() {
    form
      .validateFields()
      .then((values) => {
        updateUserProfileRequestRun({
          profile: JSON.stringify(values),
          userName: localStorage.getItem('email'),
        });
        // 同步store
        setUserInfo({
          email: localStorage.getItem('email'),
          profile: {
            background: values.background,
            accentColor: values.accentColor,
            fontSize: values.fontSize,
            language: values.language,
          },
        });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  }

  useRequest(() => UserService.userProfile(), {
    onSuccess(res) {
      const profile = res.profile;
      setUserInfo({
        email: localStorage.getItem('email'),
        profile: {
          background: profile.background,
          accentColor: profile.accentColor,
          fontSize: profile.fontSize,
          language: profile.language,
        },
      });
      form.setFieldsValue(profile);
    },
    manual: true,
  });

  const { run: updateUserProfileRequestRun } = useRequest(
    (params) => UserService.updateUserProfile(params),
    {
      onSuccess(res) {
        message.success('修改成功');
      },
      manual: true,
    },
  );

  const [targetOffset, setTargetOffset] = useState<number | undefined>(undefined);

  useEffect(() => {
    setTargetOffset(window.innerHeight / 2);
  }, []);

  return (
    <div>
      <Anchor targetOffset={targetOffset} style={{ position: 'absolute', right: '40px' }}>
        <Link href='#user-interface' title='User Interface'>
          <Link href='#dark-mode' title='Dark Mode' />
          <Link href='#primary-color' title='Primary Color' />
          <Link href='#font-size' title='Font Size' />
          <Link href='#language' title='Language' />
        </Link>
      </Anchor>

      <Form name='form' form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <h2 id='user-interface'>User Interface</h2>

        <div id='dark-mode'>
          <Form.Item label='Dark Mode' name='darkMode'>
            <Switch />
          </Form.Item>
        </div>

        <div>
          <Form.Item id='primary-color' label='Accent color' name='accentColor'>
            <div style={{ padding: '8px 0 0 0' }}>
              <CirclePicker
                width={'320px'}
                circleSize={20}
                color={color}
                onChangeComplete={(color) => {
                  console.log(color);
                  setColor(color.hex);
                }}
              />
            </div>
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
              <Option value='english'>English</Option>
              <Option value='chinese'>简体中文</Option>
            </Select>
          </Form.Item>
        </div>
      </Form>

      <div style={{ height: '800px' }}></div>
    </div>
  );
};
export default Setting;
