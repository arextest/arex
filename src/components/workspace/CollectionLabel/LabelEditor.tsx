import { Button, Form, Input, Modal } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('components');

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
          {t('workSpace.addLabelButton')}
        </Button>
      </FlexRowReverseWrapper>

      <Modal
        title={t('workSpace.labels')}
        open={modalOpen}
        onOk={handleSave}
        onCancel={handleClose}
      >
        <Form form={form} layout='vertical' name='label-form'>
          <Form.Item hidden name='id' label={t('workSpace.labelId')}>
            <Input />
          </Form.Item>

          <Form.Item required name='labelName' label={t('workSpace.labelName')}>
            <Input />
          </Form.Item>

          <Form.Item name='color' label={t('workSpace.color')}>
            <ColorPicker />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

export default LabelEditor;
