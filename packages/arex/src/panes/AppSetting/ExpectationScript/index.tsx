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
import { App, Button, DatePicker, Divider, Input, Space, Switch, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { editor } from 'monaco-editor';
import * as monaco from 'monaco-editor';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useImmer } from 'use-immer';

import { GlobalInterfaceDependencySelect } from '@/components';
import { EMAIL_KEY } from '@/constant';
import { ApplicationService, ConfigService, ReportService } from '@/services';
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
  alias: '',
  expirationTime: Date.now() + 1000 * 60 * 60 * 24 * 7,
};

const AREXDefinitionAnnotationStart = '//#AREX Definition';
const AREXDefinitionAnnotationEnd = `//#End AREX Definition
`; // keep this line break
const ExpectationScript: FC<ExpectationScriptProps> = (props) => {
  const { t } = useTranslation();
  const { theme } = useUserProfile();
  const { message } = App.useApp();
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
  const [activeOperation, setActiveOperation] = useState<{ id: string; operationName: string }>();

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
      title: 'OperationId',
      dataIndex: 'operationId',
    },
    {
      title: 'Alias',
      dataIndex: 'alias',
    },
    {
      title: 'Valid',
      dataIndex: 'valid',
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
      render: (expirationTime) => <span>{dayjs(expirationTime).format('YYYY-MM-DD')}</span>,
    },

    {
      title: 'Action',
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
    if (!activeOperation?.id) {
      return message.error('Please select operation');
    }
    const expectation: ExpectationScript = {
      dataChangeCreateTime: open === MODAL_OPEN_TYPE.Create ? Date.now() : undefined,
      appId: open === MODAL_OPEN_TYPE.Create ? props.appId : undefined,
      operationId: activeOperation?.id,
      valid: true,
      [MODAL_OPEN_TYPE.Create ? 'dataChangeCreateBy' : 'dataChangeUpdateBy']: email,
      ...editExpirationScript,
      content,
      alias: editExpirationScript.alias || activeOperation?.operationName,
    };
    updateExpectation(expectation);
  };

  const handleEditExpirationScript = (expiration: ExpectationScript) => {
    setEditExpirationScript(expiration);
    setActiveOperation({
      id: expiration.operationId as string,
      operationName: getOperationInfo(expiration.operationId)?.operationName as string,
    });
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
    setActiveOperation(undefined);
    setEditExpirationScript(initialExpirationScript);
  };

  useRequest(
    () =>
      ReportService.queryAllContracts({
        appId: props.appId,
        operationId: activeOperation?.id,
      }),
    {
      ready: !!open && !!props.appId && !!activeOperation?.id,
      refreshDeps: [open, activeOperation?.id],
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
${AREXDefinitionAnnotationEnd}` + script[script.length - 1];
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

  /**
   * 请求 InterfacesList
   */
  const { data: operationList = [] } = useRequest(
    () => ApplicationService.queryInterfacesList<'Interface'>({ appId: props.appId as string }),
    {
      ready: !!props.appId,
    },
  );

  const getOperationInfo = useCallback(
    (operationId?: string) => operationList.find((item) => item.id === operationId),
    [operationList],
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
          open === MODAL_OPEN_TYPE.Create
            ? 'Create Expiration Script'
            : 'Edit Expiration Script - ' +
              getOperationInfo(editExpirationScript?.operationId)?.operationName
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
        styles={{
          body: {
            padding: '8px 16px',
          },
        }}
        onClose={handleCloseModal}
      >
        <Space direction='vertical' size='middle' style={{ width: '100%' }}>
          <Space>
            {open === MODAL_OPEN_TYPE.Create && (
              <GlobalInterfaceDependencySelect
                appId={props.appId}
                dependency={false}
                onOperationChange={(operation) => {
                  setActiveOperation(operation);
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

            <div>
              <Label type='secondary'>Alias</Label>
              <Input
                value={editExpirationScript?.alias}
                placeholder={activeOperation?.operationName}
                onChange={(e) => {
                  setEditExpirationScript((state) => {
                    state.alias = e.target.value;
                  });
                }}
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
