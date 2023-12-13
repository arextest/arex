import { DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import {
  getLocalStorage,
  Label,
  PaneDrawer,
  SmallTextButton,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import { Editor, OnMount } from '@monaco-editor/react';
import { useRequest } from 'ahooks';
import { Button, DatePicker, Divider, Space, Switch, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { editor } from 'monaco-editor';
import * as monaco from 'monaco-editor';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useImmer } from 'use-immer';

import { GlobalInterfaceDependencySelect } from '@/components';
import { EMAIL_KEY } from '@/constant';
import { ConfigService, ReportService } from '@/services';
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

const initialExpirationScript: ExpectationScript = {
  content: '',
};

const AREXDefinitionAnnotationStart = '//#AREX Definition';
const AREXDefinitionAnnotationEnd = '//#End AREX Definition';
const ExpectationScript: FC<ExpectationScriptProps> = (props) => {
  const { t } = useTranslation();
  const { theme } = useUserProfile();
  const email = getLocalStorage(EMAIL_KEY) as string;

  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const [open, setOpen] = useState(MODAL_OPEN_TYPE.Close);
  const [editExpirationScript, setEditExpirationScript] =
    useImmer<ExpectationScript>(initialExpirationScript);

  const { data: expectationScripts = [], refresh: refreshExpectation } = useRequest(
    ConfigService.queryExpectation,
    {
      defaultParams: [{ appId: props.appId }],
    },
  );
  const [activeOperationId, setActiveOperationId] = useState<string | undefined>();

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
    const script = (editExpirationScript.content || '').split(AREXDefinitionAnnotationEnd);
    const content = script[script.length - 1].trim();
    const expectation: ExpectationScript = {
      ...editExpirationScript,
      content,
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
    expiration.id &&
      expiration.appId &&
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
    setEditExpirationScript(initialExpirationScript);
  };

  useRequest(
    () =>
      ReportService.queryAllContracts({
        appId: props.appId,
        operationId: activeOperationId,
      }),
    {
      ready: !!open && !!props.appId && !!activeOperationId,
      refreshDeps: [open, activeOperationId],
      onSuccess(allContracts) {
        const AREXDefinition = allContracts.reduce<Record<string, any>>((contracts, contract) => {
          contract.operationType = contract.operationType || 'entry';
          contract.operationName = contract.operationName || 'root';

          if (!contracts[contract.operationType]) {
            contracts[contract.operationType] = {
              [contract.operationName]: {
                response: JSON.parse(contract.contract || '{}'),
              },
            };
          } else {
            contracts[contract.operationType][contract.operationName] = {
              response: JSON.parse(contract.contract || '{}'),
            };
          }
          return contracts;
        }, {});

        setEditExpirationScript((state) => {
          const script = (state.content || '').split(AREXDefinitionAnnotationEnd);
          state.content =
            `${AREXDefinitionAnnotationStart}
const AREX = ${JSON.stringify(AREXDefinition, null, 2)}
${AREXDefinitionAnnotationEnd}
` + script[script.length - 1];
        });

        setTimeout(
          () =>
            editorRef.current?.trigger('fold', 'editor.foldAll', {
              levels: 1,
              direction: 'down',
            }),
          100,
        );
      },
    },
  );

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    monaco.languages.setLanguageConfiguration('javascript', {
      comments: {
        lineComment: '//',
        blockComment: ['/*', '*/'],
      },
      brackets: [['{', '}']],
      folding: {
        markers: {
          start: new RegExp('\\s*//\\s*#AREX Definition\\b'),
          end: new RegExp('\\s*//\\s*#End AREX Definition\\b'),
        },
      },
    });
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
          <Space>
            {open === MODAL_OPEN_TYPE.Create && (
              <GlobalInterfaceDependencySelect
                appId={props.appId}
                dependency={false}
                // onTargetChange={setTargetValue}
                onOperationChange={(operation) => {
                  setActiveOperationId(operation.id);
                  setEditExpirationScript((state) => {
                    state.title = operation.operationName;
                  });
                }}
              />
            )}

            <div>
              <div>
                <Label type='secondary'>ExpirationTime</Label>
              </div>
              <DatePicker
                value={dayjs(editExpirationScript?.expirationTime)}
                onChange={(value) =>
                  setEditExpirationScript((state) => {
                    state.expirationTime = value?.valueOf();
                  })
                }
              />
            </div>
          </Space>

          <Label type='secondary'>Script</Label>
          <Editor
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            value={editExpirationScript?.content}
            language='javascript'
            height={'400px'}
            onMount={handleEditorDidMount}
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
