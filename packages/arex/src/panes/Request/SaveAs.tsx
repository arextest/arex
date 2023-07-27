import { Form, Input, Modal, Select, TreeSelect, Typography } from 'antd';
import { FC, useState } from 'react';

import { useCollections } from '@/store';

const { Text } = Typography;

interface SaveAsProps {
  show: boolean;
  onClose: () => void;
  onOk: ({ savePath }: { savePath: string }) => void;
  collection: any[];
}
const SaveAs: FC<SaveAsProps> = ({ show, onClose, onOk, collection }) => {
  const { getPath } = useCollections();
  const [form] = Form.useForm();
  const [value, setValue] = useState<string>();
  return (
    <Modal
      open={show}
      onCancel={onClose}
      title={'SAVE REQUEST'}
      onOk={() => {
        onOk(form.getFieldsValue());
      }}
    >
      <Form
        form={form}
        layout='vertical'
        name='form_in_modal'
        initialValues={{
          modifier: 'public',
          nodeType: '1',
        }}
      >
        <p>
          <span>Save to </span>
          <Text type='secondary'>
            {getPath(value || '')
              .map((path) => path.name)
              .join('/')}
          </Text>
        </p>
        <Form.Item
          name='savePath'
          label=''
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <TreeSelect
            treeDefaultExpandAll
            placeholder='Please select'
            value={value}
            treeData={collection}
            // fieldNames={{ label: 'title', value: 'key' }}
            onChange={setValue}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SaveAs;
