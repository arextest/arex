import {
  CheckOutlined,
  CloseOutlined,
  CodeOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { CollapseProps, InputRef, Typography } from 'antd';
import { App, Button, Collapse, Input, List, Spin } from 'antd';
import React, { FC, SyntheticEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AppSettingService from '../../../services/AppSetting.service';
import {
  IgnoreNodeBase,
  InterfaceIgnoreNode,
  OperationId,
  OperationInterface,
  QueryIgnoreNode,
  QueryInterfaceIgnoreNode,
} from '../../../services/AppSetting.type';
import { SpaceBetweenWrapper } from '../../styledComponents';
import TooltipButton from '../../TooltipButton';

export type InterfacePick = Pick<OperationInterface, 'id' | 'operationName'>;

const PathCollapseWrapper = styled.div`
  margin-bottom: 16px;
  .ant-collapse-content-box {
    padding: 0 !important;
  }
  .ant-spin-nested-loading {
    width: 100%;
  }
  .disabled-node {
    cursor: not-allowed;
  }
`;

export interface PathCollapseProps extends Omit<CollapseProps, 'activeKey' | 'onChange'> {
  appId?: string;
  interfaceId?: string; // collection - interface
  title?: string;
  activeKey?: OperationId<'Global'>;
  interfaces: InterfacePick[];
  ignoreNodes: QueryInterfaceIgnoreNode[];
  loading?: boolean;
  loadingPanel?: boolean;
  manualEdit?: boolean;
  onChange?: (path?: InterfacePick, maintain?: boolean) => void;
  onReloadNodes?: () => void;
  onEditResponse?: (operationInterface: InterfacePick) => void;
}

const PathCollapse: FC<PathCollapseProps> = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

  const editInputRef = useRef<InputRef>(null);
  const [ignoredKey, setIgnoredKey] = useState('');
  const [editMode, setEditMode] = useState(false);

  const handleAddKey = (e: SyntheticEvent, path: InterfacePick) => {
    e.stopPropagation();
    if (props.manualEdit) {
      setEditMode(true);
      setTimeout(() =>
        editInputRef.current?.focus({
          cursor: 'start',
        }),
      );
    }
    props.onChange?.(path, true);
  };

  /**
   * 新增 Global IgnoreNode 数据
   */
  const { run: insertIgnoreNode } = useRequest(AppSettingService.insertIgnoreNode, {
    manual: true,
    onSuccess(success) {
      if (success) {
        message.success(t('message.updateSuccess', { ns: 'common' }));
        handleExitEdit();
        props.onReloadNodes?.();
      } else {
        message.error(t('message.updateFailed', { ns: 'common' }));
      }
    },
  });
  const handleEditSave = () => {
    if (!ignoredKey) {
      message.warning(t('appSetting.emptyKey'));
      return;
    }

    let params: IgnoreNodeBase | InterfaceIgnoreNode = {
      operationId: undefined,
      appId: props.appId,
      exclusions: ignoredKey.split('/').filter(Boolean),
    };

    props.interfaceId &&
      (params = { ...params, compareConfigType: 1, fsInterfaceId: props.interfaceId });

    insertIgnoreNode(params);
  };

  /**
   * 删除 IgnoreNode
   */
  const { run: deleteIgnoreNode } = useRequest(AppSettingService.deleteIgnoreNode, {
    manual: true,
    onSuccess(success) {
      if (success) {
        props.onReloadNodes?.();
        message.success(t('message.delSuccess', { ns: 'common' }));
      } else {
        message.error(t('message.delFailed', { ns: 'common' }));
      }
    },
  });

  const handleExitEdit = () => {
    setIgnoredKey('');
    setEditMode(false);
  };

  return (
    <PathCollapseWrapper>
      <h3>{props.title}</h3>
      <Spin spinning={props.loading || false}>
        <Collapse
          {...props}
          accordion
          activeKey={props.activeKey || undefined}
          onChange={(id) =>
            props.onChange?.(
              props.interfaces.find((i) => i.id === id),
              false,
            )
          }
        >
          {props.interfaces && Array.isArray(props.interfaces) ? (
            props.interfaces.map((path) => {
              return (
                <Collapse.Panel
                  key={String(path.id)}
                  header={path.operationName}
                  extra={[
                    <TooltipButton
                      key='add'
                      title={t('appSetting.addKey')}
                      icon={<PlusOutlined />}
                      onClick={(e) => handleAddKey(e, path)}
                    />,
                    !props.manualEdit && (
                      <TooltipButton
                        key='editResponse'
                        title={t('appSetting.editResponse')}
                        icon={<CodeOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          props.onEditResponse?.(path);
                        }}
                      />
                    ),
                  ]}
                >
                  <List
                    size='small'
                    dataSource={props.ignoreNodes}
                    loading={props.loadingPanel}
                    header={
                      editMode && (
                        <List.Item style={{ padding: '0 8px' }}>
                          <SpaceBetweenWrapper width={'100%'}>
                            <Input
                              size='small'
                              placeholder='Ignored key'
                              ref={editInputRef}
                              value={ignoredKey}
                              onChange={(e) => setIgnoredKey(e.target.value)}
                            />
                            <span style={{ display: 'flex', marginLeft: '8px' }}>
                              <Button
                                type='text'
                                size='small'
                                icon={<CloseOutlined />}
                                onClick={handleExitEdit}
                              />
                              <Button
                                type='text'
                                size='small'
                                icon={<CheckOutlined />}
                                onClick={handleEditSave}
                              />
                            </span>
                          </SpaceBetweenWrapper>
                        </List.Item>
                      )
                    }
                    renderItem={(node) => (
                      <List.Item>
                        <Spin
                          indicator={<></>}
                          spinning={!!props.interfaceId && !node.compareConfigType}
                          wrapperClassName={
                            !!props.interfaceId && !node.compareConfigType ? 'disabled-node' : ''
                          }
                        >
                          <SpaceBetweenWrapper width={'100%'}>
                            <Typography.Text ellipsis>{node.exclusions.join('/')}</Typography.Text>
                            <Button
                              type='text'
                              size='small'
                              icon={<DeleteOutlined />}
                              onClick={() => deleteIgnoreNode({ id: node.id })}
                            />
                          </SpaceBetweenWrapper>
                        </Spin>
                      </List.Item>
                    )}
                    locale={{ emptyText: t('appSetting.noIgnoredNodes') }}
                  />
                </Collapse.Panel>
              );
            })
          ) : (
            <div></div>
          )}
        </Collapse>
      </Spin>
    </PathCollapseWrapper>
  );
};

export default PathCollapse;
