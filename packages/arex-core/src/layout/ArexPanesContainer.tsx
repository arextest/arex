import { css } from '@emotion/react';
import { Dropdown, MenuProps, Tabs, TabsProps } from 'antd';
import React, { FC, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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

interface MainTabsProps extends TabsProps {
  onAdd?: () => void;
  onRemove?: (key: string) => void;
}
const ArexPanesContainer: FC<MainTabsProps> = (props) => {
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

  const orderItems = [...items].sort((a, b) => {
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
  });

  return (
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
  );
};

export default ArexPanesContainer;
