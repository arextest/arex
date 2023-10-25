import { DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import {
  getLocalStorage,
  Label,
  PaneDrawer,
  SmallTextButton,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import { Editor } from '@arextest/monaco-react';
import { useRequest } from 'ahooks';
import { Button, DatePicker, Divider, Space, Switch, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import * as monaco from 'monaco-editor';
import React, { FC, useEffect, useState } from 'react';
import { useImmer } from 'use-immer';

import { GlobalInterfaceDependencySelect } from '@/components';
import { EMAIL_KEY } from '@/constant';
import { ConfigService } from '@/services';
import { ExpectationScript } from '@/services/ConfigService';
import { useUserProfile } from '@/store';

import UndertoneWrapper from '../UndertoneWrapper';

export interface ExpectationScriptProps {
  appId: string;
}

enum MODAL_OPEN_TYPE {
  Close,
  Create,
  Edit,
}

const ExpectationScript: FC<ExpectationScriptProps> = (props) => {
  const { t } = useTranslation();
  const { theme } = useUserProfile();
  const email = getLocalStorage(EMAIL_KEY) as string;

  const [open, setOpen] = useState(MODAL_OPEN_TYPE.Close);
  const [language, setLanguage] = useState<string>();
  const [editExpirationScript, setEditExpirationScript] = useImmer<ExpectationScript>({});

  const { data: expectationScripts = [], refresh: refreshExpectation } = useRequest(
    ConfigService.queryExpectation,
    {
      defaultParams: [{ appId: props.appId }],
    },
  );

  const { run: updateExpectation, loading: updatingExpectation } = useRequest(
    ConfigService.updateExpectation,
    {
      manual: true,
      onSuccess(res) {
        refreshExpectation();
        setOpen(MODAL_OPEN_TYPE.Close);
      },
    },
  );

  const { run: deleteExpectation } = useRequest(ConfigService.deleteExpectation, {
    manual: true,
  });

  const columns: ColumnsType<ExpectationScript> = [
    {
      title: 'Name',
      dataIndex: 'title',
      width: '40%',
    },
    {
      title: 'Valid',
      dataIndex: 'valid',
      width: '20%',
      render: (valid, record) => (
        <Switch
          size='small'
          checked={valid}
          onChange={(checked) => handleToggleValid(checked, record)}
        />
      ),
    },
    {
      title: 'ExpirationTime',
      dataIndex: 'expirationTime',
      width: '20%',
      render: (expirationTime) => <span>{dayjs(expirationTime).format('YYYY-MM-DD')}</span>,
    },

    {
      title: 'Action',
      width: '300px',
      render: (text, record) => (
        <>
          <TooltipButton
            icon={<EditOutlined />}
            title={t('edit')}
            breakpoint='xl'
            color='primary'
            onClick={() => handleEditExpirationScript(record)}
          />

          <TooltipButton
            danger
            icon={<DeleteOutlined />}
            color={'error'}
            title={t('delete')}
            breakpoint='xl'
            onClick={() => handleDeleteExpirationScript(record)}
          />
        </>
      ),
    },
  ];

  const handleSaveExpirationScript = () => {
    const expectation: ExpectationScript = {
      ...editExpirationScript,
      valid: true,
      [MODAL_OPEN_TYPE.Create ? 'dataChangeCreateBy' : 'dataChangeUpdateBy']: email,
      appId: open === MODAL_OPEN_TYPE.Create ? props.appId : undefined,
    };
    updateExpectation(expectation);
  };

  const handleEditExpirationScript = (expiration: ExpectationScript) => {
    setEditExpirationScript(expiration);
    setOpen(MODAL_OPEN_TYPE.Edit);
  };

  const handleDeleteExpirationScript = (expiration: ExpectationScript) => {
    deleteExpectation({
      id: expiration.id,
      appId: expiration.appId,
    });
  };

  const handleToggleValid = (checked: boolean, expiration: ExpectationScript) => {
    updateExpectation({
      ...expiration,
      valid: checked,
      dataChangeUpdateBy: email,
    });
  };

  const handleCloseModal = () => {
    setOpen(MODAL_OPEN_TYPE.Close);
    setEditExpirationScript({});
  };

  useEffect(() => {
    monaco.languages.register({ id: props.appId });
    monaco.languages.setMonarchTokensProvider(props.appId, {
      tokenizer: {
        root: [
          [new RegExp(`\\b(${[props.appId].join('|')})\\b`), 'keyword'], // 自定义变量高亮
          [/\b(function|var|let|const)\b/, 'keyword'], // JavaScript 关键字高亮
          [/\b[0-9]+\b/, 'number'], // 数字高亮
          [/"(.*?)"/, 'string'], // 字符串高亮
          [/'(.*?)'/, 'string'], // 字符串高亮
        ],
      },
    });
    monaco.languages.registerCompletionItemProvider(props.appId, {
      // @ts-ignore
      provideCompletionItems: (model, position) => {
        const suggestions = [props.appId].map((k) => ({
          label: k,
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: k,
        }));
        return { suggestions };
      },
    });
    setLanguage(props.appId);
  }, []);

  return (
    <UndertoneWrapper>
      <Table
        size='small'
        rowKey='id'
        pagination={false}
        columns={columns}
        dataSource={expectationScripts}
        footer={() => (
          <SmallTextButton
            block
            icon={<PlusOutlined />}
            title={t('add')}
            onClick={() => setOpen(MODAL_OPEN_TYPE.Create)}
          />
        )}
      />

      <PaneDrawer
        destroyOnClose
        open={!!open}
        title={
          open === MODAL_OPEN_TYPE.Create ? 'Create Expiration Script' : editExpirationScript?.title
        }
        extra={
          <Button
            type='primary'
            size='small'
            icon={<SaveOutlined />}
            loading={updatingExpectation}
            onClick={handleSaveExpirationScript}
            style={{ float: 'right', bottom: 0 }}
          >
            {t('save')}
          </Button>
        }
        width={'65%'}
        bodyStyle={{ padding: '8px 16px' }}
        onClose={handleCloseModal}
      >
        <Space direction='vertical' size='middle' style={{ width: '100%' }}>
          {open === MODAL_OPEN_TYPE.Create && (
            <GlobalInterfaceDependencySelect
              appId={props.appId}
              onOperationChange={(operation) =>
                setEditExpirationScript((state) => {
                  state.title = operation.operationName;
                })
              }
              onDependencyChange={(dependency) => {
                setEditExpirationScript((state) => {
                  dependency && (state.title = dependency.operationName);
                });
              }}
            />
          )}

          <div>
            <Label type='secondary'>ExpirationTime</Label>
            <DatePicker
              value={dayjs(editExpirationScript?.expirationTime)}
              onChange={(value) =>
                setEditExpirationScript((state) => {
                  state.expirationTime = value?.valueOf();
                })
              }
            />
          </div>

          <Label type='secondary'>Script</Label>
          <Editor
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            value={editExpirationScript?.content}
            language={language}
            height={'400px'}
            onChange={(value) => {
              setEditExpirationScript((state) => {
                state.content = value;
              });
            }}
          />
        </Space>

        {(editExpirationScript?.dataChangeUpdateBy || editExpirationScript?.dataChangeCreateBy) && (
          <Divider style={{ marginBottom: '8px' }} />
        )}

        <Space size='large'>
          {editExpirationScript?.dataChangeCreateBy && (
            <div>
              <Label type='secondary'>CreateBy</Label>
              <Typography.Text type='secondary'>
                {editExpirationScript?.dataChangeCreateBy}
              </Typography.Text>
            </div>
          )}

          {editExpirationScript?.dataChangeUpdateBy && (
            <div>
              <Label type='secondary'>UpdateBy</Label>
              <Typography.Text type='secondary'>
                {editExpirationScript?.dataChangeUpdateBy}
              </Typography.Text>
            </div>
          )}
        </Space>
      </PaneDrawer>
    </UndertoneWrapper>
  );
};

export default ExpectationScript;
