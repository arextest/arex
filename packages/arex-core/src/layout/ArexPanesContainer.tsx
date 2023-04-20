import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Dropdown, MenuProps, Tabs, TabsProps } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { EmptyWrapper } from '../components';

// https://ant.design/components/tabs-cn/#components-tabs-demo-custom-tab-bar-node
const dropdownItems: MenuProps['items'] = [
  {
    label: 'Close',
    key: '1',
  },
  {
    label: 'Close Other Tabs',
    key: '2',
  },
  {
    label: 'Close All Tabs',
    key: '3',
  },
  {
    label: 'Close Unmodified Tabs',
    key: '4',
  },
  {
    label: 'Close Tabs to the Left',
    key: '5',
  },
  {
    label: 'Close Tabs to the Right',
    key: '6',
  },
];

const type = 'DraggableTabNode';
interface DraggableTabPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  index: React.Key;
  moveNode: (dragIndex: React.Key, hoverIndex: React.Key) => void;
}

const DraggableTabNode = ({ index, children, moveNode }: DraggableTabPaneProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: 'dropping',
      };
    },
    drop: (item: { index: React.Key }) => {
      moveNode(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <div ref={ref} className={isOver ? dropClassName : ''}>
      {children}
    </div>
  );
};

export interface ArexPanesContainerProps extends TabsProps {
  onAdd?: () => void;
  onRemove?: (key: string) => void;
}

const ArexPanesContainer = styled((props: ArexPanesContainerProps) => {
  const { onAdd, onRemove, ...restTabsProps } = props;
  const removeTab = (targetKey: React.MouseEvent | React.KeyboardEvent | string) => {
    onRemove?.(targetKey as string);
  };

  const handleTabsEdit: TabsProps['onEdit'] = (targetKey, action) => {
    action === 'add' ? onAdd?.() : removeTab(targetKey);
  };

  const { items = [] } = props;
  const [order, setOrder] = useState<React.Key[]>([]);

  const moveTabNode = (dragKey: React.Key, hoverKey: React.Key) => {
    const newOrder = order.slice();

    items.forEach((item) => {
      if (item.key && newOrder.indexOf(item.key) === -1) {
        newOrder.push(item.key);
      }
    });

    const dragIndex = newOrder.indexOf(dragKey);
    const hoverIndex = newOrder.indexOf(hoverKey);

    newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, dragKey);

    setOrder(newOrder);
  };

  const renderTabBar: TabsProps['renderTabBar'] = (tabBarProps, DefaultTabBar) => (
    <DefaultTabBar {...tabBarProps}>
      {(node) => {
        return (
          <DraggableTabNode key={node.key} index={node.key!} moveNode={moveTabNode}>
            <Dropdown
              menu={{
                items: dropdownItems,
                onClick: function (e) {
                  // props.onClickContextMenu({
                  //   tabKey: String(node.key),
                  //   clickKey: e.key,
                  //   order,
                  // });
                },
              }}
              trigger={['contextMenu']}
            >
              <>{node}</>
            </Dropdown>
          </DraggableTabNode>
        );
      }}
    </DefaultTabBar>
  );

  const orderItems = useMemo(
    () =>
      items.sort((a, b) => {
        const orderA = order.indexOf(a.key!);
        const orderB = order.indexOf(b.key!);

        if (orderA !== -1 && orderB !== -1) {
          return orderA - orderB;
        }
        if (orderA !== -1) {
          return -1;
        }
        if (orderB !== -1) {
          return 1;
        }

        const ia = items.indexOf(a);
        const ib = items.indexOf(b);

        return ia - ib;
      }),
    [items],
  );

  return (
    <EmptyWrapper
      empty={!orderItems.length}
      description={
        <Button type='primary' onClick={props.onAdd}>
          New Request
        </Button>
      }
    >
      <DndProvider backend={HTML5Backend}>
        <Tabs
          css={css`
            .ant-tabs-nav {
              margin-bottom: 0;
            }
          `}
          renderTabBar={renderTabBar}
          size='small'
          type='editable-card'
          tabBarGutter={-1}
          onEdit={handleTabsEdit}
          items={orderItems}
          {...restTabsProps}
        />
      </DndProvider>
    </EmptyWrapper>
  );
})`
  height: 100%;
  // 工作区 Tabs 全局样式调整
  .ant-tabs-tab {
    .ant-tabs-tab-btn {
      color: ${(props) => props.theme.colorTextSecondary}!important;
    }
    :hover {
      .ant-tabs-tab-btn {
        color: ${(props) => props.theme.colorText}!important;
      }
    }
  }

  .ant-tabs-tab-with-remove {
    padding: 6px 12px !important;
    // 添加高亮条 tabs-ink-bar
    // 注意当前的作用范围很广，目前的作用对象为工作区所有的可编辑可删除卡片式 Tab
    // .ant-tabs-tab-with-remove 类是为了避免污染一般的 Tabs
    &.ant-tabs-tab-active {
      :after {
        content: '';
        position: absolute;
        top: -1px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: ${(props) => props.theme.colorPrimary};
        transition: all 0.2s ease-in-out;
      }
    }
    .ant-tabs-tab-remove {
      margin-left: 0;
      padding-right: 0;
    }
  }

  .main-tabs {
    overflow: auto;
    height: inherit;
    padding: 0 16px;
  }

  .ant-tabs-nav-operations {
    margin-bottom: 0 !important;
    .ant-tabs-nav-more {
      padding: 8px 12px;
      border: 1px solid ${(props) => props.theme.colorBorderSecondary};
      border-bottom-color: ${(props) => props.theme.colorBorder};
      border-radius: ${(props) => props.theme.borderRadius}px
        ${(props) => props.theme.borderRadius}px 0 0;
    }
    .ant-tabs-nav-add {
      margin-left: -1px;
      border-bottom-color: ${(props) => props.theme.colorBorderSecondary};
    }
  }

  .ant-tabs-nav-more {
    height: 36px;
    border-left: #000c17 1px solid;
  }
  .ant-tabs-content {
    height: 100%;
    .ant-tabs-tabpane {
      height: inherit;
      padding: 0 16px;
      overflow-y: overlay;
    }
  }
`;

export default ArexPanesContainer;
