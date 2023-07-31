import { CheckOutlined, CloseOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons';
import {
  css,
  PaneDrawer,
  SmallTextButton,
  SpaceBetweenWrapper,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import {
  AutoComplete,
  Button,
  ButtonProps,
  Card,
  Collapse,
  Input,
  InputRef,
  List,
  Space,
  Typography,
} from 'antd';
import { CarouselRef } from 'antd/lib/carousel';
import React, { FC, useMemo, useRef, useState } from 'react';

import { CONFIG_TYPE } from '@/panes/AppSetting/CompareConfig';
import CompareConfigTitle, {
  CompareConfigTitleProps,
} from '@/panes/AppSetting/CompareConfig/CompareConfigTitle';
import { DependencyParams } from '@/services/ComparisonService';

import TreeCarousel from '../TreeCarousel';
import ArrayTree from './ArrayTree';
import SortTree from './SortTree';

export type NodeMaskingProps = {
  appId: string;
  operationId?: string;
  dependency?: DependencyParams;
  readOnly?: boolean;
  syncing?: boolean;
  loadingContract?: boolean;
  configType: CONFIG_TYPE;
  contractParsed: { [p: string]: any };
  onAdd?: () => void;
  onSync?: () => void;
  onClose?: () => void;
};

const ActiveKey = 'masking';
enum TreeEditModeEnum {
  ArrayTree,
  SortTree,
}

const NodeMasking: FC<NodeMaskingProps> = (props) => {
  const { t } = useTranslation();

  const searchRef = useRef<InputRef>(null);
  const treeCarouselRef = React.useRef<CarouselRef>(null);

  const [treeEditMode, setTreeEditMode] = useState<TreeEditModeEnum>(TreeEditModeEnum.ArrayTree);

  const [activeKey, setActiveKey] = useState<string | string[]>([ActiveKey]);
  const [search, setSearch] = useState<string | false>(false);
  const handleSearch: ButtonProps['onClick'] = (e) => {
    activeKey?.[0] === ActiveKey && e.stopPropagation();
    setTimeout(() => searchRef.current?.focus());

    setSearch('');
  };

  const {
    data: maskingNodes = [],
    loading: loadingMaskingNode,
    run: getMaskingNodes,
  } = useRequest(
    () => Promise.resolve([{ exclusions: ['a'] }, { exclusions: ['b'] }, { exclusions: ['c'] }]),
    {},
  );

  const maskingNodesFiltered = useMemo(
    () =>
      typeof search === 'string' && search
        ? maskingNodes.filter((node) =>
            node.exclusions.join('/').toLowerCase().includes(search.toLowerCase()),
          )
        : maskingNodes,
    [maskingNodes, search],
  );

  const handleMaskingAdd: CompareConfigTitleProps['onAdd'] = (e) => {
    activeKey?.[0] === ActiveKey && e.stopPropagation();
    props.onAdd?.();
  };

  const handleDeleteMaskingNode = () => {
    console.log('handleDeleteMaskingNode');
  };

  return (
    <>
      <Collapse
        size='small'
        activeKey={activeKey}
        items={[
          {
            key: ActiveKey,
            label: (
              <CompareConfigTitle
                title='Nodes Masking'
                readOnly={props.readOnly}
                onSearch={handleSearch}
                onAdd={handleMaskingAdd}
              />
            ),
            children: (
              <Card bordered={false} size='small' bodyStyle={{ padding: 0 }}>
                <List
                  size='small'
                  dataSource={maskingNodesFiltered}
                  loading={loadingMaskingNode}
                  header={
                    search !== false && (
                      <SpaceBetweenWrapper style={{ padding: '0 16px' }}>
                        <Input.Search
                          size='small'
                          ref={searchRef}
                          placeholder='Search for ignored key'
                          onChange={(e) => setSearch(e.target.value)}
                          style={{ marginRight: '8px' }}
                        />
                        <Button
                          size='small'
                          type='text'
                          icon={<CloseOutlined />}
                          onClick={() => setSearch(false)}
                        />
                      </SpaceBetweenWrapper>
                    )
                  }
                  renderItem={(node) => (
                    <List.Item>
                      <SpaceBetweenWrapper width={'100%'}>
                        <Typography.Text ellipsis>{node.exclusions.join('/')}</Typography.Text>
                        {!props.readOnly && (
                          <SmallTextButton
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteMaskingNode({ id: node.id })}
                          />
                        )}
                      </SpaceBetweenWrapper>
                    </List.Item>
                  )}
                  locale={{ emptyText: t('appSetting.noIgnoredNodes') }}
                />
              </Card>
            ),
          },
        ]}
        onChange={setActiveKey}
        css={css`
          flex: 1;
          margin: 0 16px 16px 0;
          height: fit-content;
          .ant-collapse-content-box {
            padding: 0 !important;
          }
        `}
      />

      <PaneDrawer
        width='60%'
        title={
          <SpaceBetweenWrapper>
            <Space size='middle'>
              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                {t('appSetting.nodesSort')}
              </Typography.Title>

              <Button
                size='small'
                disabled={props.syncing}
                icon={<SyncOutlined spin={props.syncing} />}
                onClick={props.onSync}
              >
                {t('appSetting.sync', { ns: 'components' })}
              </Button>
            </Space>
            {treeEditMode === TreeEditModeEnum.SortTree && (
              <Button size='small' type='primary' onClick={handleSaveMasking}>
                {t('save', { ns: 'common' })}
              </Button>
            )}
          </SpaceBetweenWrapper>
        }
        open={openMaskingModal}
        onClose={handleCancelEdit}
      >
        <TreeCarousel ref={treeCarouselRef} beforeChange={(from, to) => setTreeEditMode(to)}>
          <ArrayTree
            loading={props.loadingContract}
            treeData={props.contractParsed}
            sortNodeList={sortNodeList}
            onSelect={(selectedKeys) =>
              handleEditCollapseItem(
                selectedKeys[0] as string,
                sortNodeList.find((node) => node.path === selectedKeys[0]),
              )
            }
          />

          <SortTree
            title={checkedNodesData.path}
            treeData={sortArray}
            checkedKeys={checkedNodesData.pathKeyList}
            onCheck={handleSortTreeChecked}
            onSelect={handleSortTreeSelected}
          />
        </TreeCarousel>
      </PaneDrawer>
    </>
  );
};

export default NodeMasking;
