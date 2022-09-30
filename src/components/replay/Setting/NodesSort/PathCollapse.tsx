import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, Collapse, List } from 'antd';
import React, { FC, useState } from 'react';

type InterfacesCheckedNodes = { [key: string]: string[] };
type PathCollapseProps = {
  activeKey?: string;
  activeCollapseKey?: string;
  onChange: (path: string) => void;
  onEdit?: (path: string, selected: string) => void;
  onDelete?: (path: string | undefined, selected: string[]) => void;
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
  const handleEdit = (path: string, key: string) => {
    console.log({ path, key });
    props.onEdit && props.onEdit(path, key);
  };

  const handleDelete = (path: string, key: string) =>
    props.onDelete &&
    props.onDelete(
      path,
      props.checkedNodes[path].filter((p) => p !== key),
    );

  return (
    <CollapseWrapper
      accordion
      activeKey={props.activeKey}
      onChange={(activeKey) => props.onChange && props.onChange(activeKey as string)}
    >
      {props.interfaces.map((path) => {
        return (
          <Collapse.Panel key={path} header={path}>
            <List
              size='small'
              dataSource={props.checkedNodes[path]}
              renderItem={(key) => (
                <List.Item
                  className={props.activeCollapseKey === `${path}_${key}` ? 'active-item' : ''}
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
                      <Button
                        type='text'
                        size='small'
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(path, key)}
                      />
                      <Button
                        type='text'
                        size='small'
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(path, key)}
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
