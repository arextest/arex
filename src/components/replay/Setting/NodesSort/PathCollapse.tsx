import { CodepenOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, Collapse, List } from 'antd';
import React, { FC } from 'react';

import { TooltipButton } from '../../../index';

type InterfacesCheckedNodes = { [key: string]: { [key: string]: string[] } };
type PathCollapseProps = {
  activeKey?: string;
  activeCollapseKey?: string;
  onChange: (path: string) => void;
  onEdit?: (selected?: string) => void;
  onDelete?: (selected: string) => void;
  onEditResponse?: (path: string) => void;
  interfaces: string[];
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
  const handleEdit = (key?: string) => {
    props.onEdit && props.onEdit(key);
  };

  const handleDelete = (key: string) => props.onDelete && props.onDelete(key);

  return (
    <CollapseWrapper
      accordion
      activeKey={props.activeKey}
      onChange={(activeKey) => props.onChange && props.onChange(activeKey as string)}
    >
      {props.interfaces.map((path) => {
        return (
          <Collapse.Panel
            key={path}
            header={path}
            extra={
              <TooltipButton
                type='text'
                size='small'
                icon={<CodepenOutlined />}
                title='Edit Response'
                onClick={(e) => {
                  e.stopPropagation();
                  props.onEditResponse && props.onEditResponse(path);
                }}
              />
            }
          >
            <List
              size='small'
              dataSource={Object.keys(props.checkedNodes[path] || {})}
              renderItem={(key) => (
                <List.Item
                  className={
                    `${props.activeKey}_${props.activeCollapseKey}` === `${path}_${key}`
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
                        {`${props.checkedNodes[path][key].length} keys`}
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
