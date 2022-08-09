import styled from '@emotion/styled';
import { Button, Form, Input, Modal, Radio, RadioChangeEvent, Select, Tabs } from 'antd';
import { FC, useState } from 'react';
const { TabPane } = Tabs;
import { SketchPicker } from 'react-color';
const { Option } = Select;

type Props = {
  isModalVisible: boolean;
  setModalVisible: (isVisible: boolean) => void;
};

const Tabsddd = styled(Tabs)`
  .ant-tabs-nav-list {
    margin-left: 12px;
  }
`;

const ColorInput = ({ value = {}, onChange = () => {} }) => {
  return (
    <div style={{ width: '100%' }}>
      <SketchPicker
        color={value}
        onChangeComplete={(color) => {
          onChange(color.hex);
        }}
      />
    </div>
  );
};

const Setting: FC<Props> = ({ isModalVisible, setModalVisible }) => {
  const plainOptions = ['Light', 'Dark'];
  function handleOk() {
    setModalVisible(false);
  }
  function handleCancel() {
    setModalVisible(false);
  }
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div>
      <Modal
        width={720}
        bodyStyle={{ padding: '0', height: '65vh', overflowY: 'scroll' }}
        title='SETTINGS'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tabsddd defaultActiveKey='1' onChange={() => {}}>
          <TabPane tab='Themes' key='1'>
            <div style={{ padding: '20px' }}>
              <Form
                name='basic'
                layout={'vertical'}
                initialValues={{
                  background: 'Dark',
                  fontSize: 'small',
                  language: 'english',
                  accentColor: 'red',
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete='off'
              >
                <Form.Item
                  label='Background'
                  name='background'
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Radio.Group optionType={'button'} options={plainOptions} />
                </Form.Item>

                <Form.Item
                  label='Accent color'
                  name='accentColor'
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <ColorInput></ColorInput>
                </Form.Item>

                <Form.Item
                  label='Font size'
                  name='fontSize'
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Select defaultValue='Small' style={{ width: 120 }}>
                    <Option value='small'>Small</Option>
                    <Option value='medium'>Medium</Option>
                    <Option value='large'>Large</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label='Language'
                  name='language'
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Select style={{ width: 120 }}>
                    <Option value='english'>English</Option>
                    <Option value='chinese'>简体中文</Option>
                  </Select>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type='primary' htmlType='submit'>
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </TabPane>
        </Tabsddd>
      </Modal>
    </div>
  );
};
export default Setting;
