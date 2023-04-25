import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  GlobalOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { App, Input, Select } from 'antd';
import React, { FC, ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RoleEnum, RoleMap, TooltipButton } from '../index';

const Role = styled((props: { className?: string; role?: RoleEnum }) => (
  <span className={props.className}>{props.role && `(${RoleMap[props.role]})`}</span>
))`
  margin-left: 4px;
  color: ${(props) => props.theme.colorTextTertiary};
`;

const WorkspacesMenuWrapper = styled('div', {
  shouldForwardProp: (propName) => propName !== 'collapsed',
})<{ collapsed?: boolean }>`
  height: 36px;
  width: ${(props) => (props.collapsed ? '100%' : 'calc(100% + 10px)')};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 16px;
  overflow: hidden;
  color: ${(props) => props.theme.colorText};
  border-bottom: 1px solid ${(props) => props.theme.colorBorder};
`;

export type WorkspaceItem = { label: React.ReactNode; value: string; role?: RoleEnum };
export type WorkspacesMenuProps = {
  collapsed?: boolean;
  value?: string;
  options?: WorkspaceItem[];
  extra?: ReactNode;
  onAdd?(name: string): void;
  onChange?(id: string): void;
  onEdit?(id: string): void;
};

const WorkspacesMenu: FC<WorkspacesMenuProps> = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

  const [editMode, setEditMode] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [status, setStatus] = useState<'' | 'error'>('');

  const workspaceName = useMemo(() => {
    const workspace = props.options?.find((ws) => ws.value === props.value);
    return workspace?.label;
  }, [props.value, props.options]);

  const handleAddWorkspace = () => {
    if (newWorkspaceName === '') {
      setStatus('error');
      message.error(t('workSpace.emptySpaceName'));
    } else {
      props.onAdd?.(newWorkspaceName);
    }
  };

  const reset = () => {
    setEditMode(false);
    setStatus('');
    setNewWorkspaceName('');
  };

  return (
    <WorkspacesMenuWrapper collapsed={props.collapsed}>
      <>
        <TooltipButton
          icon={<GlobalOutlined />}
          title={`${t('workSpace.workSpace')}${props.collapsed ? ': ' + workspaceName : ''}`}
          placement='right'
          style={{
            marginLeft: props.collapsed ? '8px' : '0',
            transition: 'all 0.2s',
          }}
        />

        {!props.collapsed &&
          (editMode ? (
            <Input
              size='small'
              value={newWorkspaceName}
              status={status}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              style={{ width: '75%', margin: '0 8px' }}
            />
          ) : (
            <Select
              size='small'
              bordered={false}
              value={props.value}
              options={props.options?.map((ws) => ({
                value: ws.value,
                label: (
                  <>
                    {ws.label} <Role role={ws.role} />
                  </>
                ),
              }))}
              onChange={props.onChange}
              style={{ width: '80%' }}
            />
          ))}
      </>

      <>
        {!props.collapsed && (
          <>
            <div style={{ display: 'flex' }}>
              {editMode ? (
                <>
                  <TooltipButton
                    icon={<CheckOutlined />}
                    title={t('save', { ns: 'common' })}
                    onClick={handleAddWorkspace}
                  />
                  <TooltipButton
                    icon={<CloseOutlined />}
                    title={t('cancel', { ns: 'common' })}
                    onClick={reset}
                  />
                </>
              ) : (
                <>
                  <TooltipButton
                    icon={<PlusOutlined />}
                    title={t('workSpace.add')}
                    onClick={() => setEditMode(true)}
                  />
                  <TooltipButton
                    icon={<EditOutlined />}
                    title={t('workSpace.edit')}
                    onClick={() => props.value && props.onEdit?.(props.value)}
                  />
                </>
              )}

              {/* extra Button Group */}
              {props.extra}
            </div>
          </>
        )}
      </>
    </WorkspacesMenuWrapper>
  );
};

export default WorkspacesMenu;
