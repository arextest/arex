import { DownOutlined } from '@ant-design/icons';
import { getLocalStorage, useTranslation } from '@arextest/arex-core';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import {
  App,
  Button,
  ConfigProvider,
  Form,
  FormProps,
  Input,
  Modal,
  Tooltip,
  TreeSelect,
  Typography,
} from 'antd';
import { CollectionsSaveRequest } from 'arex-common';
import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';

import { CollectionNodeType, EMAIL_KEY } from '@/constant';
import treeData from '@/panes/ReplayCase/mock.json';
import { FileSystemService } from '@/services';
import {
  AddItemFromRecordByDefaultReq,
  AddItemFromRecordReq,
  CollectionType,
  dddItemFromRecordByDefault,
} from '@/services/FileSystemService';
import { ReplayCaseType } from '@/services/ReportService';
import { useCollections, useWorkspaces } from '@/store';

const { Text } = Typography;

type OptionType = {
  label: string;
  value: string;
  disabled?: boolean;
  children?: OptionType[];
};

export type SaveCaseRef = {
  openModal: (record: ReplayCaseType) => void;
};

export type SaveCaseProps = {
  planId: string;
  operationId: string;
  operationName: string;
  appId: string;
};

const SaveCase = forwardRef<SaveCaseRef, SaveCaseProps>((props, ref) => {
  const { notification } = App.useApp();
  const { t } = useTranslation(['components', 'common', 'page']);
  const userName = getLocalStorage(EMAIL_KEY) as string;

  // appName > interfaceName
  const { collectionsTreeData, getPath, getCollections } = useCollections();
  const { activeWorkspaceId: workspaceId } = useWorkspaces();

  const [form] = Form.useForm();
  const [open, setOpen] = useState<boolean>(false);
  const [open1, setOpen1] = useState<boolean>(false);

  const [title, setTitle] = useState('');
  const [pathTo, setPathTo] = useState('');

  useImperativeHandle(ref, () => ({
    openModal: (record) => {
      setOpen(true);
      setTitle(record.recordId);
      form.setFieldsValue({
        recordId: record.recordId,
        nodeName: record.recordId,
      });
    },
  }));

  const collectionTreeSelectData = useMemo(() => {
    const mapTree = (tree: CollectionType[]) => {
      const result: OptionType[] = [];
      for (const node of tree) {
        result.push({
          label: node.nodeName,
          value: node.infoId,
          disabled: node.nodeType !== CollectionNodeType.interface,
          children: node.nodeType === CollectionNodeType.folder ? mapTree(node.children || []) : [],
        });
      }
      return result;
    };
    return mapTree(collectionsTreeData);
  }, [collectionsTreeData]);

  const { run: addItemFromRecord, loading } = useRequest(
    (values: Pick<AddItemFromRecordReq, 'parentPath' | 'nodeName' | 'recordId'>) =>
      FileSystemService.addItemFromRecord({
        workspaceId: workspaceId as string,
        userName,
        planId: props.planId,
        operationId: props.operationId,
        ...values,
      }),
    {
      manual: true,
      onSuccess: (success) => {
        if (success) {
          notification.success({ message: t('message.saveSuccess', { ns: 'common' }) });
          handleClose();
          getCollections();
        } else {
          notification.error({ message: t('message.saveFailed', { ns: 'common' }) });
        }
      },
    },
  );

  const { run: dddItemFromRecordByDefault, loading: l1 } = useRequest(
    (values: AddItemFromRecordByDefaultReq) => FileSystemService.dddItemFromRecordByDefault(values),
    {
      manual: true,
      onSuccess: (success) => {
        if (success) {
          notification.success({ message: t('message.saveSuccess', { ns: 'common' }) });
          handleClose();
          getCollections();
        } else {
          notification.error({ message: t('message.saveFailed', { ns: 'common' }) });
        }
      },
    },
  );

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      dddItemFromRecordByDefault({
        workspaceId: workspaceId,
        appName: props.appId,
        interfaceName: props.operationName,
        nodeName: values.nodeName,
        planId: props.planId,
        operationId: props.operationId,
        recordId: values.recordId,
      });
    });
  };

  const handleValuesChange: FormProps['onValuesChange'] = (value, values) => {
    const touched = Object.prototype.hasOwnProperty.call(value, 'savePath');

    touched &&
      setPathTo(
        getPath(values.savePath)
          .map((path) => path.name)
          .join('/'),
      );
  };

  const handleClose = () => {
    setOpen(false);
    form.resetFields();
    setPathTo('');
  };

  return (
    <>
      <Modal
        open={open}
        title={`${t('replay.saveCase')} - ${title}`}
        okText={t('replay.create')}
        cancelText={t('cancel', { ns: 'common' })}
        onCancel={handleClose}
        onOk={handleSubmit}
        confirmLoading={loading}
      >
        <Form
          form={form}
          onValuesChange={handleValuesChange}
          layout='vertical'
          name='form_in_modal'
        >
          <Form.Item hidden name='recordId' label='recordId'>
            <Input />
          </Form.Item>

          <Form.Item
            name='nodeName'
            label={t('replay.caseName')}
            rules={[
              {
                required: true,
                message: t('replay.emptyCaseName') as string,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <div>
            <span>{t('replay.saveTo')}</span>{' '}
            <Text type='secondary'>
              {props.appId} &gt;{' '}
              <span
                css={css`
                  color: #66bb6a;
                `}
              >
                GET
              </span>{' '}
              {props.operationName}
            </Text>
            <Tooltip title={t('replay.saveto', { ns: 'page' })}>
              <Button
                onClick={() => {
                  setOpen1(true);
                }}
                size={'small'}
                css={css`
                  padding: 0 4px !important;
                  margin-left: 10px;
                `}
              >
                <DownOutlined />
              </Button>
            </Tooltip>
          </div>
        </Form>
      </Modal>

      <CollectionsSaveRequest
        title={t('replay.saveCase')}
        // @ts-ignore
        treeData={treeData}
        open={open1}
        requestName={form.getFieldsValue().recordId}
        onCreateFolder={(newFolderName, parentFolderKey) => {
          console.log(newFolderName, parentFolderKey);
          return new Promise((resolve) => {});
        }}
        onSave={(folderKey, requestName) => {
          console.log(folderKey, requestName);

          console.log({
            parentPath: getPath(folderKey).map((path) => path.id),
            nodeName: requestName,
            recordId: form.getFieldsValue().recordId,
          });
          // addItemFromRecord({
          //   parentPath: getPath(folderKey).map((path) => path.id),
          //   nodeName: requestName,
          //   recordId: form.getFieldsValue().recordId,
          // });
        }}
        onClose={() => {
          setOpen1(false);
        }}
      />
    </>
  );
});

export default SaveCase;
