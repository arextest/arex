import { DeleteOutlined, DownOutlined, LeftOutlined, MenuOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Collapse, Popconfirm, Space, Switch, theme } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DragDropContext, DragDropContextProps, Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';

import { ScriptBlock, ScriptBlocksList } from './index';

const { Panel } = Collapse;

export const FlexRowReverseWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  .ant-btn-primary {
    margin-bottom: 8px;
  }
`;

export type ScriptBlocksCollapseProps<T = string> = {
  value: ScriptBlock<T>[];
  onDrag?: (source: number, destination: number) => void;
  onChange?: (id: string, value: ScriptBlock<any>) => void;
  onDelete?: (id: string) => void;
};

function ScriptBlocksCollapse<T = string>(props: ScriptBlocksCollapseProps<T>) {
  const { t } = useTranslation('common');
  const { token } = theme.useToken();
  const count = useRef(0);

  const [activeKey, setActiveKey] = useState<string>();
  const onDragEnd: DragDropContextProps['onDragEnd'] = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    props.onDrag?.(result.source.index, result.destination.index);
  };

  useEffect(() => {
    props.value.length === 1 && setActiveKey(props.value[0].key);
    if (props.value.length === count.current + 1) setActiveKey(props.value.at(-1)?.key);
    count.current = props.value.length;
  }, [props.value.length]);

  const handleChange = useCallback(
    (id: string, attr: keyof ScriptBlock<any>, value: ScriptBlock<any>[typeof attr]) => {
      const target = props.value.find((v) => v.key === id);
      const clone = Object.assign({}, target, { [attr]: value });
      props.onChange?.(id, clone);
    },
    [props],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='droppable'>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {props.value.map((item, index) => (
              <Draggable key={item.key} draggableId={item.key} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps}>
                    <div
                      css={css`
                        margin: 8px 0;
                        width: 100%;
                        .ant-collapse-header-text {
                          flex: 1 !important;
                        }
                      `}
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
                          key={item.key}
                          header={
                            <div>
                              <span style={{ color: token.colorPrimary }}> {item.icon} </span>
                              <span
                                style={{
                                  color: item.disabled ? token.colorTextDisabled : undefined,
                                  transition: 'color 0.2s ease',
                                }}
                              >
                                {item.label}
                              </span>
                            </div>
                          }
                          extra={
                            <Space>
                              <Switch
                                size='small'
                                checked={!item.disabled}
                                onChange={(checked) => {
                                  handleChange(item.key, 'disabled', !checked);
                                }}
                              />
                              <Popconfirm
                                okText='Yes'
                                cancelText='No'
                                placement='topRight'
                                title='Are you sure to delete this script?'
                                onConfirm={() => props.onDelete?.(item.key)}
                              >
                                <Button
                                  size='small'
                                  type='text'
                                  icon={<DeleteOutlined />}
                                  title={t('delete')}
                                />
                              </Popconfirm>
                              <LeftOutlined
                                css={css`
                                  transform: rotate(${activeKey === item.key ? '-90deg' : 0});
                                  transition: all 0.3s ease;
                                `}
                                onClick={() => setActiveKey(item.key)}
                              />
                            </Space>
                          }
                        >
                          {/* Dynamic ScriptBlock Component */}
                          {/* TODO 区分不同组件的 props 注入 */}
                          {React.createElement(
                            ScriptBlocksList.find((block) => block.type === item.type)?.component ||
                              ScriptBlocksList[0].component,
                            {
                              disabled: item.disabled,
                              value: item.value as string,
                              language: 'javascript',
                              onChange: (value: any) => handleChange(item.key, 'value', value),
                            },
                          )}
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
}

export default ScriptBlocksCollapse;
