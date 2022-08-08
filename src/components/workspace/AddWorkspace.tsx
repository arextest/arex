import { Button, Form, Input, Modal } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { WorkspaceService } from '../../services/Workspace.service';

const AddWorkspace = () => {
  const _useParams = useParams();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      <Button style={{ width: '100%' }} type={'primary'} onClick={() => setVisible(true)}>
        Create Workspace
      </Button>
      <Modal
        zIndex={10001}
        visible={visible}
        title='Create workspace'
        okText='Create'
        cancelText='Cancel'
        onCancel={() => setVisible(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              WorkspaceService.createWorkspace({
                userName: localStorage.getItem('email'),
                workspaceName: values.name,
              }).then((res) => {
                if (res.body.success) {
                  const key = res.body.infoId;
                  const label = values.name;
                  window.location.href = `/${key}/workspace/${label}`
                }
              });
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form form={form} layout='vertical' name='form_in_modal'>
          <Form.Item
            name='name'
            label='Name'
            rules={[
              {
                required: true,
                message: 'Please input the name of workspace!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddWorkspace;
