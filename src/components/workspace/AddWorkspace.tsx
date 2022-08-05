import { Button, Form, Input, Modal, TreeSelect } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { treeFindPath } from '../../helpers/collection/util';
import { CollectionService } from '../../services/CollectionService';
import { FileSystemService } from '../../services/FileSystem.service';
import { WorkspaceService } from '../../services/WorkspaceService';

const AddWorkspace = () => {
  const _useParams = useParams();
  const [form] = Form.useForm();
  const [value, setValue] = useState<string>();
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
              console.log(values, 'va');
              WorkspaceService.createWorkspace({
                userName: localStorage.getItem('email'),
                workspaceName: values.name,
              }).then((res) => {
                console.log(res, 'fff');
                const workspaceId = '';
                const workspaceName = '';
                if (res.data.body.success) {
                  // window.location.href = `/${workspaceId}/workspace/${workspaceName}`
                  window.location.reload();
                }
              });
              // onCreate(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form
          form={form}
          layout='vertical'
          name='form_in_modal'
          initialValues={{
            modifier: 'public',
          }}
        >
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
