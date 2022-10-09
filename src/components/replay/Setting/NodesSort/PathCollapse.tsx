import { CodeOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, Collapse, List } from 'antd';
import React, { FC } from 'react';

import { OperationInterface } from '../../../../services/Replay.type';
import { TooltipButton } from '../../../index';

type InterfacesCheckedNodes = { [key: string]: { [key: string]: string[] } };
type PathCollapseProps = {
  activeKey?: string;
  activeCollapseKey?: string;
  onChange: (operationInterface?: OperationInterface, maintain?: boolean) => void;
  onEdit?: (selected?: string) => void;
  onDelete?: (selected: string) => void;
  onEditResponse?: (operationInterface: OperationInterface) => void;
  interfaces: OperationInterface[];
  checkedNodes: InterfacesCheckedNodes;
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
  const handleEdit = (key?: string) => props.onEdit && props.onEdit(key);
  const handleDelete = (key: string) => props.onDelete && props.onDelete(key);

  return (
    <CollapseWrapper
      accordion
      activeKey={props.activeKey}
      onChange={(id) => props.onChange && props.onChange(props.interfaces.find((i) => i.id === id))}
    >
      {props.interfaces.map((i) => {
        return (
          <Collapse.Panel
            key={i.id}
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
              dataSource={Object.keys(props.checkedNodes[i.id] || {})}
              renderItem={(key) => (
                <List.Item
                  className={
                    `${props.activeKey}_${props.activeCollapseKey}` === `${i.id}_${key}`
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
                    <span>{key}</span>
                    <span>
                      <span style={{ marginRight: '8px' }}>
                        {`${props.checkedNodes[i.id][key].length} keys`}
                      </span>
                      <Button
                        type='text'
                        size='small'
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(key)}
                      />
                      <Button
                        type='text'
                        size='small'
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(key)}
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
