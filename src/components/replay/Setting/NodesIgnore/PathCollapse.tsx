import { CodeOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Button, Collapse, List } from 'antd';
import React, { FC } from 'react';

import { OperationInterface } from '../../../../services/AppSetting.type';
import { TooltipButton } from '../../../index';

type PathCollapseProps = {
  activeKey?: string;
  interfaces: OperationInterface[];
  checkedNodes: string[];
  onChange: (path?: OperationInterface) => void;
  onSelect: (path: OperationInterface, selected: string[]) => void;
  onEditResponse: (operationInterface: OperationInterface) => void;
};

const PathCollapse: FC<PathCollapseProps> = (props) => {
  return (
    <Collapse
      accordion
      activeKey={props.activeKey}
      css={css`
        .ant-collapse-content-box {
          padding: 0 !important;
        }
      `}
      onChange={(id) => props.onChange && props.onChange(props.interfaces.find((i) => i.id === id))}
    >
      {props.interfaces && Array.isArray(props.interfaces) ? (
        props.interfaces.map((path) => {
          return (
            <Collapse.Panel
              key={path.id}
              header={path.operationName}
              extra={[
                <TooltipButton key='add' icon={<PlusOutlined />} title='Add Sort Key' />,
                <TooltipButton
                  key='editResponse'
                  icon={<CodeOutlined />}
                  title='Edit Response'
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onEditResponse && props.onEditResponse(path);
                  }}
                />,
              ]}
            >
              <List
                size='small'
                dataSource={props.checkedNodes}
                renderItem={(key) => (
                  <List.Item>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <span>{key}</span>
                      <Button
                        type='text'
                        size='small'
                        icon={<DeleteOutlined />}
                        onClick={() =>
                          props.onSelect &&
                          props.onSelect(
                            path,
                            props.checkedNodes.filter((p) => p !== key),
                          )
                        }
                      />
                    </div>
                  </List.Item>
                )}
                locale={{ emptyText: 'No Ignored Nodes' }}
              />
            </Collapse.Panel>
          );
        })
      ) : (
        <></>
      )}
    </Collapse>
  );
};

export default PathCollapse;
