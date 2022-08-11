import styled from '@emotion/styled';
import { Form, message, Modal, ModalProps, Radio, Select, Switch, Tabs } from 'antd';
import { FC, useState } from 'react';
const { TabPane } = Tabs;
import { useMount, useRequest } from 'ahooks';
import { CirclePicker } from 'react-color';

import { UserService } from '../services/UserService';
import { useStore } from '../store';
const { Option } = Select;

type SettingProps = {
  visible: boolean;
  onCancel: ModalProps['onCancel'];
};

const SettingTabs = styled(Tabs)`
  .ant-tabs-nav-list {
    margin-left: 12px;
  }
`;

const Setting: FC<SettingProps> = (props) => {
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

  const { run: userProfileRequestRun } = useRequest(() => UserService.userProfile(), {
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
  useMount(() => {
    userProfileRequestRun();
  });
  return (
    <div>
      <Modal
        width={720}
        bodyStyle={{ padding: '0', height: '65vh', overflowY: 'scroll' }}
        title='SETTINGS'
        visible={props.visible}
        onOk={handleOk}
        onCancel={props.onCancel}
        forceRender
      >
        <SettingTabs defaultActiveKey='1' onChange={() => {}}>
          <TabPane tab='Themes' key='1'>
            <div style={{ padding: '20px' }}>
              <Form name='basic' form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Form.Item label='Dark Mode' name='darkMode'>
                  <Switch />
                </Form.Item>

                <Form.Item label='Accent color' name='accentColor'>
                  <div style={{ padding: '8px 0 0 0' }}>
                    <CirclePicker
                      width={'300px'}
                      circleSize={20}
                      color={color}
                      onChangeComplete={(color) => {
                        console.log(color);
                        setColor(color.hex);
                      }}
                    />
                  </div>
                </Form.Item>

                <Form.Item label='Font size' name='fontSize'>
                  <Select style={{ width: 120 }}>
                    <Option value='small'>Small</Option>
                    <Option value='medium'>Medium</Option>
                    <Option value='large'>Large</Option>
                  </Select>
                </Form.Item>

                <Form.Item label='Language' name='language'>
                  <Select style={{ width: 120 }}>
                    <Option value='english'>English</Option>
                    <Option value='chinese'>简体中文</Option>
                  </Select>
                </Form.Item>
              </Form>
            </div>
          </TabPane>
        </SettingTabs>
      </Modal>
    </div>
  );
};
export default Setting;
