import { DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Collapse, Popconfirm, Space, Switch } from 'antd';
import React, { FC, useCallback, useState } from 'react';
import { DragDropContext, DragDropContextProps, Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';

import ScriptBlocks, { ScriptBlock } from './scriptBlocks';

const { Panel } = Collapse;

export const FlexRowReverse = styled.div`
  display: flex;
  flex-direction: row-reverse;
  .ant-btn-primary {
    margin-bottom: 8px;
  }
`;

export type ScriptBlocksCollapseProps = {
  value: ScriptBlock<any>[];
  onDrag: (source: number, destination: number) => void;
  onChange: (id: string, value: ScriptBlock<any>) => void;
  onDelete: (id: string) => void;
};
const ScriptBlocksCollapse: FC<ScriptBlocksCollapseProps> = (props) => {
  const { t } = useTranslation('common');
  const { color } = useTheme();

  const [activeKey, setActiveKey] = useState<string>();
  const onDragEnd: DragDropContextProps['onDragEnd'] = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    props.onDrag?.(result.source.index, result.destination.index);
  };

  const handleChange = useCallback(
    (id: string, attr: keyof ScriptBlock<any>, value: ScriptBlock<any>[typeof attr]) => {
      const target = props.value.find((v) => v.id === id);
      const clone = Object.assign({}, target, { [attr]: value });
      props.onChange?.(id, clone);
    },
    [props],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='droppable'>
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {props.value.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.draggableProps}>
                    <div
                      style={{
                        width: '100%',
                        margin: '8px 0',
                      }}
                    >
                      <Collapse
                        accordion
                        activeKey={activeKey}
                        collapsible='header'
                        expandIcon={() => (
                          <MenuOutlined
                            {...provided.dragHandleProps}
                            onClick={(e) => e.stopPropagation()}
                            style={{ cursor: 'grab' }}
                          />
                        )}
                        onChange={(value) => setActiveKey(value as string)}
                      >
                        <Panel
                          key={item.id}
                          header={
                            <>
                              <span css={{ color: color.primary }}> {item.icon} </span>
                              <span
                                css={{
                                  color: item.disabled ? color.text.disabled : undefined,
                                  transition: 'color 0.2s ease',
                                }}
                              >
                                {item.title}
                              </span>
                            </>
                          }
                          extra={
                            <Space>
                              <Switch
                                size='small'
                                checked={!item.disabled}
                                onChange={(checked) => {
                                  handleChange(item.id, 'disabled', !checked);
                                }}
                              />
                              <Popconfirm
                                okText='Yes'
                                cancelText='No'
                                placement='topRight'
                                title='Are you sure to delete this script?'
                                onConfirm={() => props.onDelete?.(item.id)}
                              >
                                <Button
                                  size='small'
                                  type='text'
                                  icon={<DeleteOutlined />}
                                  title={t('delete')}
                                />
                              </Popconfirm>
                            </Space>
                          }
                        >
                          {/* Dynamic ScriptBlock Component */}
                          {React.createElement(ScriptBlocks[item.type], {
                            value: item.data,
                            onChange: (value) => handleChange(item.id, 'data', value),
                          })}
                        </Panel>
                      </Collapse>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ScriptBlocksCollapse;
