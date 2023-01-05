import {
  CheckOutlined,
  CloseOutlined,
  CodeOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import type { InputRef } from 'antd';
import { App, Button, Collapse, Input, List, Spin } from 'antd';
import React, { FC, SyntheticEvent, useRef, useState } from 'react';

import AppSettingService from '../../../services/AppSetting.service';
import {
  IgnoreNodeBase,
  InterfaceIgnoreNode,
  OperationId,
  OperationInterface,
  QueryIgnoreNode,
} from '../../../services/AppSetting.type';
import { SpaceBetweenWrapper } from '../../styledComponents';
import TooltipButton from '../../TooltipButton';

export type InterfacePick = Pick<OperationInterface, 'id' | 'operationName'>;

const PathCollapseWrapper = styled.div`
  margin-bottom: 16px;
  .ant-collapse-content-box {
    padding: 0 !important;
  }
`;

type PathCollapseProps = {
  appId?: string;
  interfaceId?: string; // collection - interface
  title?: string;
  activeKey?: OperationId<'Global'>;
  interfaces: InterfacePick[];
  ignoreNodes: QueryIgnoreNode[];
  loading?: boolean;
  loadingPanel?: boolean;
  manualEdit?: boolean;
  onChange?: (path?: InterfacePick, maintain?: boolean) => void;
  onReloadNodes?: () => void;
  onEditResponse?: (operationInterface: InterfacePick) => void;
};

const PathCollapse: FC<PathCollapseProps> = (props) => {
  const { message } = App.useApp();

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
        message.success('Update successfully');
        handleExitEdit();
        props.onReloadNodes?.();
      }
    },
  });
  const handleEditSave = () => {
    if (!ignoredKey) {
      message.warning('Please enter ignored key');
      return;
    }

    let params: IgnoreNodeBase | InterfaceIgnoreNode = {
      appId: props.appId,
      operationId: null,
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
        message.success('Delete successfully');
      } else {
        message.error('Delete failed');
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
                      title='Add Key'
                      icon={<PlusOutlined />}
                      onClick={(e) => handleAddKey(e, path)}
                    />,
                    !props.manualEdit && (
                      <TooltipButton
                        key='editResponse'
                        title='Edit Response'
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
                        <SpaceBetweenWrapper width={'100%'}>
                          <span>{node.exclusions.join('/')}</span>
                          <Button
                            type='text'
                            size='small'
                            icon={<DeleteOutlined />}
                            onClick={() => deleteIgnoreNode({ id: node.id })}
                          />
                        </SpaceBetweenWrapper>
                      </List.Item>
                    )}
                    locale={{ emptyText: 'No Ignored Nodes' }}
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
