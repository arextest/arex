import { Button, Form, Input, Modal } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { FlexRowReverseWrapper } from '../../ScriptBlocks/ScriptBlocksCollapse';
import ColorPicker from './ColorPicker';

type LabelFormType = {
  id: string;
  labelName: string;
  color: string;
};

export type LabelEditorProps = {
  onSave: (value: LabelFormType) => void;
};

export type LabelEditorRef = {
  showModal: (initFormValue?: LabelFormType) => void;
};

const LabelEditor = forwardRef<LabelEditorRef, LabelEditorProps>((props, ref) => {
  const [form] = Form.useForm<LabelFormType>();
  const [modalOpen, setModalOpen] = useState(false);

  const showModal: LabelEditorRef['showModal'] = (initFormValue) => {
    initFormValue &&
      form.setFieldsValue({
        id: initFormValue.id,
        labelName: initFormValue.labelName,
        color: initFormValue.color || 'default',
      });
    setModalOpen(true);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        props.onSave(values);
        handleClose();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleClose = () => {
    setModalOpen(false);
    form.resetFields();
  };

  useImperativeHandle(ref, () => ({
    showModal,
  }));

  return (
    <>
      <FlexRowReverseWrapper style={{ marginBottom: '8px' }}>
        <Button size='small' type='primary' onClick={() => showModal()}>
          New Label
        </Button>
      </FlexRowReverseWrapper>

      <Modal title='Labels' open={modalOpen} onOk={handleSave} onCancel={handleClose}>
        <Form form={form} layout='vertical' name='label-form'>
          <Form.Item hidden name='id' label='Id'>
            <Input />
          </Form.Item>

          <Form.Item required name='labelName' label='Label Name'>
            <Input />
          </Form.Item>

          <Form.Item name='color' label='Color'>
            <ColorPicker />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

export default LabelEditor;
