import { Form, Input, Modal, Select, TreeSelect, Typography } from 'antd';
import Tree from 'antd/es/tree/Tree';
import { FC, useState } from 'react';

import { treeFindPath } from '../../helpers/collection/util';

const { Text } = Typography;

interface SaveAsProps {
  show: boolean;
  onHide: () => void;
  onOk: ({ savePath }: { savePath: string[] }) => void;
  collection: any[];
}
const SaveAs: FC<SaveAsProps> = ({ show, onHide, onOk, collection }) => {
  const [form] = Form.useForm();
  const [value, setValue] = useState<string>();
  return (
    <Modal
      open={show}
      onCancel={onHide}
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
            {treeFindPath(
              collection,
              (node: { value: string; title: string }) => node.value === value,
            )
              .map((path: { title: string }) => path.title)
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
