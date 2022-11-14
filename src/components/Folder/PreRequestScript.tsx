import { CodeOutlined, MenuOutlined } from '@ant-design/icons';
import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import { Button, Collapse } from 'antd';
import React, { FC, ReactNode } from 'react';
import { DragDropContext, DragDropContextProps, Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';

import { useStore } from '../../store';

type CodeBlock<T> = { id: string; type: 'custom'; icon: ReactNode; title: ReactNode; data: T };

const { Panel } = Collapse;

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// fake data generator
const getItems = (count: number): CodeBlock<string>[] =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    type: 'custom',
    icon: <CodeOutlined />,
    title: '自定义代脚本',
    data: '',
  }));

const PreRequestScript: FC = () => {
  const { t } = useTranslation('common');
  const { themeClassify } = useStore();

  const [items, setItems] = useImmer<CodeBlock<string>[]>(getItems(5));
  const onDragEnd: DragDropContextProps['onDragEnd'] = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    setItems(reorder(items, result.source.index, result.destination.index));
  };
  return (
    <>
      <Button
        style={{ marginBottom: '16px' }}
        onClick={() => {
          console.log({ items });
        }}
      >
        {t('save')}
      </Button>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable'>
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items.map((item, index) => (
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
                          collapsible='header'
                          expandIcon={() => (
                            <MenuOutlined
                              {...provided.dragHandleProps}
                              onClick={(e) => e.stopPropagation()}
                              style={{ cursor: 'grab' }}
                            />
                          )}
                        >
                          <Panel
                            header={
                              <>
                                {item.icon}
                                {item.title}
                              </>
                            }
                            key={index}
                          >
                            <Button type='primary' size='small' style={{ marginBottom: '8px' }}>
                              {t('save')}
                            </Button>
                            <CodeMirror
                              value={item.data}
                              height='300px'
                              extensions={[javascript()]}
                              theme={themeClassify}
                              onChange={(value) => {
                                setItems((state) => {
                                  const target = state.find((s) => s.id === item.id);
                                  target && (target.data = value);
                                });
                              }}
                            />
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
    </>
  );
};

export default PreRequestScript;
