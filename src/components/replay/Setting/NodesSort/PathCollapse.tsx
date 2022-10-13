import { CodeOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Button, Collapse, List, message } from 'antd';
import React, { FC } from 'react';

import AppSettingService from '../../../../services/AppSetting.service';
import { OperationId, OperationInterface, SortNode } from '../../../../services/AppSetting.type';
import { TooltipButton } from '../../../index';

type PathCollapseProps = {
  activeKey?: OperationId<'Interface'>;
  activeCollapseKey?: string;
  onChange: (operationInterface?: OperationInterface<'Interface'>, maintain?: boolean) => void;
  onEdit?: (sortNode?: SortNode) => void;
  onEditResponse?: (operationInterface: OperationInterface<'Interface'>) => void;
  interfaces: OperationInterface<'Interface'>[];
  sortNodes: SortNode[];
  onReloadNodes?: () => void;
};

const CollapseWrapper = styled(Collapse)`
  .ant-collapse-content-box {
    padding: 0 !important;
  }
  .active-item {
    background-color: ${(props) => props.theme.color.selected};
    transition: background-color 200ms ease;
  }
`;

const PathCollapse: FC<PathCollapseProps> = (props) => {
  const handleEdit = (sortNode?: SortNode) => props.onEdit && props.onEdit(sortNode);

  /**
   * 删除 IgnoreNode
   */
  const { run: deleteIgnoreNode } = useRequest(AppSettingService.deleteSortNode, {
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

  return (
    <CollapseWrapper
      accordion
      activeKey={props.activeKey || undefined}
      onChange={(id) => props.onChange && props.onChange(props.interfaces.find((i) => i.id === id))}
    >
      {props.interfaces.map((i) => {
        return (
          <Collapse.Panel
            key={String(i.id)}
            header={i.operationName}
            extra={[
              <TooltipButton
                key='add'
                icon={<PlusOutlined />}
                title='Add Sort Key'
                onClick={(e) => {
                  e.stopPropagation();
                  props.onChange && props.onChange(i, true);
                }}
              />,
              <TooltipButton
                key='editResponse'
                icon={<CodeOutlined />}
                title='Edit Response'
                onClick={(e) => {
                  e.stopPropagation();
                  props.onEditResponse && props.onEditResponse(i);
                }}
              />,
            ]}
          >
            <List
              size='small'
              dataSource={props.sortNodes}
              renderItem={(sortNode) => (
                <List.Item
                  className={
                    `${props.activeKey}_${props.activeCollapseKey}` === `${i.id}_${sortNode.id}`
                      ? 'active-item'
                      : ''
                  }
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <span>{sortNode.path}</span>
                    <span>
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
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: 'No Sort Nodes' }}
            />
          </Collapse.Panel>
        );
      })}
    </CollapseWrapper>
  );
};

export default PathCollapse;
