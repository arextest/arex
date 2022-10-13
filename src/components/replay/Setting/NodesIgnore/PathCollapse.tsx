import { CodeOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Button, Collapse, List } from 'antd';
import React, { FC } from 'react';

import { IgnoreNode, OperationInterface } from '../../../../services/AppSetting.type';
import { TooltipButton } from '../../../index';
import { SpaceBetweenWrapper } from '../../../styledComponents';

type PathCollapseProps = {
  activeKey?: string;
  interfaces: OperationInterface[];
  checkedNodes: IgnoreNode[];
  onChange: (path?: OperationInterface, maintain?: boolean) => void;
  onDelete: (ignoreNode: IgnoreNode) => void;
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
      onChange={(id) =>
        props.onChange &&
        props.onChange(
          props.interfaces.find((i) => i.id === id),
          false,
        )
      }
    >
      {props.interfaces && Array.isArray(props.interfaces) ? (
        props.interfaces.map((path) => {
          return (
            <Collapse.Panel
              key={path.id}
              header={path.operationName}
              extra={[
                <TooltipButton
                  key='add'
                  icon={<PlusOutlined />}
                  title='Add Sort Key'
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onChange && props.onChange(path, true);
                  }}
                />,
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
                renderItem={(node) => (
                  <List.Item>
                    <SpaceBetweenWrapper width={'100%'}>
                      <span>{node.exclusions.join('/')}</span>
                      <Button
                        type='text'
                        size='small'
                        icon={<DeleteOutlined />}
                        onClick={() => props.onDelete && props.onDelete(node)}
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
        <></>
      )}
    </Collapse>
  );
};

export default PathCollapse;
