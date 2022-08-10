import styled from '@emotion/styled';
import { Form, message, Modal, Radio, Select, Tabs } from 'antd';
import { FC } from 'react';
const { TabPane } = Tabs;
import { useMount, useRequest } from 'ahooks';
import { SketchPicker } from 'react-color';

import { UserService } from '../../services/UserService';
import { useStore } from '../../store';
const { Option } = Select;

type Props = {
  isModalVisible: boolean;
  setModalVisible: (isVisible: boolean) => void;
};

const SettingTabs = styled(Tabs)`
  .ant-tabs-nav-list {
    margin-left: 12px;
  }
`;

const ColorInput = ({ value = {}, onChange = () => {} }) => {
  return (
    <div>
      <SketchPicker
        width={'260px'}
        color={value}
        onChangeComplete={(color) => {
          onChange(color.hex);
        }}
      />
    </div>
  );
};

const Setting: FC<Props> = ({ isModalVisible, setModalVisible }) => {
  const plainOptions = ['light', 'dark'];
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
  function handleCancel() {
    setModalVisible(false);
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
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        forceRender
      >
        <SettingTabs defaultActiveKey='1' onChange={() => {}}>
          <TabPane tab='Themes' key='1'>
            <div style={{ padding: '20px' }}>
              <Form name='basic' layout={'vertical'} form={form}>
                <Form.Item label='Background' name='background'>
                  <Radio.Group optionType={'button'} options={plainOptions} />
                </Form.Item>

                <Form.Item label='Accent color' name='accentColor'>
                  <ColorInput></ColorInput>
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
