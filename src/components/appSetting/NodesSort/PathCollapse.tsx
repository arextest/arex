import { CodeOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { App, Button, Collapse, CollapseProps, List, Spin, Typography } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import AppSettingService from '../../../services/AppSetting.service';
import { OperationId, OperationInterface, SortNode } from '../../../services/AppSetting.type';
import { SpaceBetweenWrapper } from '../../styledComponents';
import TooltipButton from '../../TooltipButton';

export interface PathCollapseProps extends Omit<CollapseProps, 'activeKey' | 'onChange'> {
  interfaceId?: string;
  title?: string;
  height?: string;
  loading?: boolean;
  loadingPanel?: boolean;
  activeKey?: OperationId<'Interface'>;
  activeCollapseKey?: SortNode;
  onChange: (operationInterface?: OperationInterface<'Interface'>, maintain?: boolean) => void;
  onEdit?: (path: string, sortNode?: SortNode) => void;
  onEditResponse?: (operationInterface: OperationInterface<'Interface'>) => void;
  interfaces: OperationInterface<'Interface'>[];
  sortNodes: SortNode[];
  onReloadNodes?: () => void;
}

const CollapseWrapper = styled.div`
  .ant-collapse-content-box {
    padding: 0 !important;
  }
  .active-item {
    background-color: ${(props) => props.theme.colorPrimaryBg};
    transition: background-color 200ms ease;
  }
  .ant-spin-nested-loading {
    width: 100%;
  }
  .disabled-node {
    cursor: not-allowed;
  }
`;

const PathCollapse: FC<PathCollapseProps> = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

  const handleEdit = (sortNode: SortNode) => props.onEdit && props.onEdit(sortNode.path, sortNode);

  /**
   * 删除 IgnoreNode
   */
  const { run: deleteIgnoreNode } = useRequest(AppSettingService.deleteSortNode, {
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

  return (
    <CollapseWrapper>
      {props.title && <h3>{props.title}</h3>}
      <Spin spinning={props.loading || false}>
        <Collapse
          {...props}
          accordion
          activeKey={props.activeKey || undefined}
          onChange={(id) =>
            props.onChange && props.onChange(props.interfaces.find((i) => i.id === id))
          }
          css={css`
            height: ${props.height};
            overflow-y: auto;
          `}
        >
          {props.interfaces.map((i) => (
            <Collapse.Panel
              key={String(i.id)}
              header={i.operationName}
              extra={
                <>
                  <TooltipButton
                    key='add'
                    icon={<PlusOutlined />}
                    title={t('appSetting.addSortKey')}
                    onClick={(e) => {
                      e.stopPropagation();
                      props.onChange?.(i, true);
                    }}
                  />
                  {!props.interfaceId && (
                    <TooltipButton
                      key='editResponse'
                      icon={<CodeOutlined />}
                      title={t('appSetting.editResponse')}
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onEditResponse?.(i);
                      }}
                    />
                  )}
                </>
              }
            >
              <List
                size='small'
                loading={props.loadingPanel}
                dataSource={props.sortNodes}
                renderItem={(sortNode) => (
                  <List.Item
                    className={
                      `${props.activeKey}_${props.activeCollapseKey?.id}` ===
                      `${i.id}_${sortNode.id}`
                        ? 'active-item'
                        : ''
                    }
                  >
                    <Spin
                      indicator={<></>}
                      spinning={!sortNode.compareConfigType}
                      wrapperClassName={!sortNode.compareConfigType ? 'disabled-node' : ''}
                    >
                      <SpaceBetweenWrapper width={'100%'}>
                        <Typography.Text ellipsis>{sortNode.path}</Typography.Text>
                        <span style={{ flexShrink: 0 }}>
                          <span style={{ marginRight: '8px' }}>
                            {`${sortNode.pathKeyList.length} keys`}
                          </span>
                          <Button
                            type='text'
                            size='small'
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(sortNode)}
                          />
                          <Button
                            type='text'
                            size='small'
                            icon={<DeleteOutlined />}
                            onClick={() => deleteIgnoreNode({ id: sortNode.id })}
                          />
                        </span>
                      </SpaceBetweenWrapper>
                    </Spin>
                  </List.Item>
                )}
                locale={{ emptyText: t('appSetting.noSortNodes') }}
              />
            </Collapse.Panel>
          ))}
        </Collapse>
      </Spin>
    </CollapseWrapper>
  );
};

export default PathCollapse;
