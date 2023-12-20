import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Dropdown, MenuProps, Tabs, TabsProps, Typography } from 'antd';
import React, { createContext, Key, PropsWithChildren, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { EmptyWrapper, ErrorBoundary, RequestMethodIcon } from '../components';
import { ArexPaneNamespace } from '../constant';
import { Pane } from '../panes';
import { ArexPaneManager } from '../utils';

interface DraggableTabPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-node-key': string;
}

const DraggableTabNode = ({ className, ...props }: DraggableTabPaneProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props['data-node-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleX: 1 }),
    transition,
    cursor: 'move',
  };

  return React.cloneElement(props.children as React.ReactElement, {
    ref: setNodeRef,
    style,
    ...attributes,
    ...listeners,
  });
};

interface DraggableTabPaneProps extends PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  index: React.Key;
  moveNode: (dragIndex: React.Key, hoverIndex: React.Key) => void;
}

export interface MenuInfo {
  key: string;
  keyPath: string[];
  /** @deprecated This will not support in the future. You should avoid to use this */
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

export const PaneContext = createContext<{
  data?: any;
  paneKey: string;
}>({
  data: undefined,
  paneKey: '',
});

export interface ArexPanesContainerProps extends Omit<TabsProps, 'items' | 'onDragEnd'> {
  emptyNode: React.ReactNode;
  panes?: Pane[];
  onAdd?: () => void;
  dropdownMenu?: Omit<MenuProps, 'onClick'> & { onClick: (e: MenuInfo, key: Key | null) => void };
  onDragEnd?: (event: DragEndEvent) => void;
  onRemove?: (key: string) => void;
  onClickContextMenu?: (key: string) => void;
}

const ArexPanesContainerWrapper = styled.div`
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
      // noinspection CssInvalidPropertyValue
      overflow-y: overlay;
    }
  }
`;

const ArexPanesContainer = (props: ArexPanesContainerProps) => {
  const {
    panes = [],
    emptyNode,
    dropdownMenu,
    onAdd,
    onRemove,
    onDragEnd,
    ...restTabsProps
  } = props;
  // 规定: ArexMenu 翻译文本需要配置在 locales/[lang]/arex-menu.json 下, 且 key 为 Menu.types
  const { t } = useTranslation([ArexPaneNamespace]);

  const panesItems = useMemo(
    () =>
      (panes
        .map((pane) => {
          const Pane = ArexPaneManager.getPaneByType(pane.type);
          if (!Pane) return;

          const paneProps = { data: pane.data, paneKey: pane.key as string };
          return {
            key: pane.key || '',
            // 规定: 翻译文本需要配置在 locales/[lang]/arex-pane.json 下, 且 key 为 Pane.types
            label: (
              <>
                <span>
                  {pane.icon
                    ? React.createElement(
                        RequestMethodIcon[pane.icon] || RequestMethodIcon['QuestionOutlined'],
                      )
                    : Pane.icon}
                </span>
                <Typography.Text ellipsis style={{ maxWidth: '120px' }}>
                  {pane.name === false ? t(Pane.type) : `${t(Pane.type)} - ${pane.name || pane.id}`}
                </Typography.Text>
              </>
            ),
            children: (
              <ErrorBoundary>
                <PaneContext.Provider value={paneProps}>
                  <div
                    id={`arex-pane-wrapper-${pane.key}`}
                    style={{
                      padding: Pane.noPadding ? 0 : '8px 16px',
                      height: 'calc(100vh - 116px)',
                    }}
                  >
                    {React.createElement(Pane, paneProps)}
                  </div>
                </PaneContext.Provider>
              </ErrorBoundary>
            ),
          };
        })
        .filter(Boolean) as TabsProps['items']) || [],
    [panes, t],
  );

  const removeTab = (targetKey: React.MouseEvent | React.KeyboardEvent | string) => {
    onRemove?.(targetKey as string);
  };

  const handleTabsEdit: TabsProps['onEdit'] = (targetKey, action) => {
    action === 'add' ? onAdd?.() : removeTab(targetKey);
  };

  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  return (
    <ArexPanesContainerWrapper>
      <EmptyWrapper empty={!panesItems?.length} description={emptyNode}>
        <Tabs
          css={css`
            .ant-tabs-nav {
              margin-bottom: 0;
            }
          `}
          popupClassName='arex-pane-popup'
          renderTabBar={(tabBarProps, DefaultTabBar) => (
            <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
              <SortableContext
                items={panesItems?.map((i) => i.key) || []}
                strategy={horizontalListSortingStrategy}
              >
                <DefaultTabBar {...tabBarProps}>
                  {(node) => (
                    <DraggableTabNode {...node.props} key={node.key}>
                      <div>
                        {React.createElement(
                          dropdownMenu ? Dropdown : 'div',
                          {
                            menu: {
                              ...dropdownMenu,
                              onClick: (e) => dropdownMenu?.onClick?.(e, node.key),
                            },
                            trigger: ['contextMenu'],
                          },
                          node,
                        )}
                      </div>
                    </DraggableTabNode>
                  )}
                </DefaultTabBar>
              </SortableContext>
            </DndContext>
          )}
          size='small'
          type='editable-card'
          tabBarGutter={-1}
          onEdit={handleTabsEdit}
          items={panesItems}
          {...restTabsProps}
        />
      </EmptyWrapper>
    </ArexPanesContainerWrapper>
  );
};

export default ArexPanesContainer;
