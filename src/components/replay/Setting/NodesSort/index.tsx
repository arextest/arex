import styled from '@emotion/styled';
import { Button, Card, Carousel, Col, Row, Select } from 'antd';
import { CarouselRef } from 'antd/lib/carousel';
import React, { FC, useMemo, useRef, useState } from 'react';
import { useImmer } from 'use-immer';

import { tryParseJsonString } from '../../../../utils';
import { EditAreaPlaceholder } from '../../../styledComponents';
import ResponseRaw from '../NodesIgnore/ResponseRaw';
import ArrayTree from './ArrayTree';
import PathCollapse from './PathCollapse';
import SortTree from './SortTree';

enum NodesEditMode {
  'Tree' = 'Tree',
  'Raw' = 'Raw',
}

const MockInterfaces = ['/owners', '/owners/find'];
const MockResponse: { [key: string]: any } = {
  parent1: { child1: { bar: '1' }, child2: '2' },
  numberArray: [1, 2, 3],
  stringArray: ['a', 'b', 'c'],
  objectArray: [
    {
      number: 1,
      string: 'a',
      object: {
        number: 11,
        string: 'aa',
      },
    },
    {
      number: 2,
      string: 'b',
      object: {
        number: 22,
        string: 'bb',
      },
    },
  ],
};

const ignoredNodesEditModeOptions = [
  { label: 'Tree', value: NodesEditMode.Tree },
  { label: 'Raw', value: NodesEditMode.Raw },
];

const TreeCarousel = styled(Carousel)`
  .slick-dots-bottom {
    position: relative;
    margin: 12px 0 0 0;
  }
  .slick-dots.slick-dots-bottom {
    li > button {
      background-color: ${(props) => props.theme.color.text.disabled}!important;
    }
    * > li.slick-active > button {
      background-color: ${(props) => props.theme.color.text.watermark}!important;
    }
  }
`;

const NodesSort: FC<{ appId: string }> = () => {
  const treeCarousel = useRef<CarouselRef>(null);

  const [rawResponse, setRawResponse] = useState<object>(MockResponse);
  const rawResponseString = useMemo(() => JSON.stringify(rawResponse, null, 2), [rawResponse]);

  const [activeKey, setActiveKey] = useState<string>();
  const [activeCollapseKey, setActiveCollapseKey] = useState<string>();

  const [nodesEditMode, setNodesEditMode] = useState<NodesEditMode>(NodesEditMode.Tree);
  const handleEditResponse = (path: string) => {
    console.log('setNodesEditMode to Raw', path);
    setNodesEditMode(NodesEditMode.Raw);
  };

  const [checkedNodesData, setCheckedNodesData] = useImmer<{
    [key: string]: // interface
    {
      [key: string]: // path
      string[];
    }; // sorted keys
  }>({});

  const [sortArray, setSortArray] = useState<any[]>();

  const handleSortTreeChecked = (checked: string[]) => {
    activeKey &&
      activeCollapseKey &&
      setCheckedNodesData((state) => {
        if (!state[activeKey]) {
          state[activeKey] = {};
        }
        state[activeKey][activeCollapseKey] = checked;
      });
  };

  const handleResponseRawSave = (value?: string) => {
    if (value) {
      const res = tryParseJsonString(value);
      res && setRawResponse(res);
      setNodesEditMode(NodesEditMode.Tree);
      treeCarousel.current?.goTo(0);
    }
  };

  const handleIgnoredNodesCollapseClick = (key?: string) => {
    setNodesEditMode(NodesEditMode.Tree);
    treeCarousel.current?.goTo(0);

    setActiveKey(key !== activeKey ? key : undefined);
    key && handleSetSortArray(key);
  };

  const handleEditCollapseItem = (key?: string) => {
    if (key) {
      setActiveCollapseKey(key);
      handleSetSortArray(key);
    }
    setNodesEditMode(NodesEditMode.Tree);
    treeCarousel.current?.goTo(1);
  };

  const handleDeleteCollapseItem = (key: string) => {
    activeKey &&
      setCheckedNodesData((state) => {
        delete state[activeKey][key];
      });
  };

  // 获取待排序操作的数组结构
  const handleSetSortArray = (key: string) => {
    let value: any = undefined;
    key
      .split('/')
      .filter(Boolean)
      .forEach((k, i) => {
        value = i === 0 ? MockResponse[k] : value[k];
      });

    setSortArray(value);
  };

  const handleSave = () => {
    console.log('save', checkedNodesData);
  };

  return (
    <>
      <Row justify='space-between' style={{ margin: 0, flexWrap: 'nowrap' }}>
        <Col span={10}>
          <h3>Interfaces</h3>
          <PathCollapse
            interfaces={MockInterfaces}
            activeKey={activeKey}
            activeCollapseKey={activeCollapseKey}
            checkedNodes={checkedNodesData}
            onEdit={handleEditCollapseItem}
            onChange={handleIgnoredNodesCollapseClick}
            onDelete={handleDeleteCollapseItem}
            onEditResponse={handleEditResponse}
          />
        </Col>

        <Col span={13}>
          <EditAreaPlaceholder
            dashedBorder
            title='Edit Area (Click interface to start)'
            ready={!!activeKey}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>{nodesEditMode}</h3>
              <Select
                bordered={false}
                options={ignoredNodesEditModeOptions}
                value={nodesEditMode}
                onChange={setNodesEditMode}
              />
            </div>

            {nodesEditMode === NodesEditMode.Tree ? (
              <Card bodyStyle={{ padding: 0 }}>
                <TreeCarousel ref={treeCarousel}>
                  <div>
                    <ArrayTree
                      title={activeKey}
                      treeData={rawResponse}
                      selectedKeys={[activeCollapseKey as string]}
                      sortedKeys={checkedNodesData[activeKey || '']}
                      onSelect={(selectedKeys, info) => {
                        // 选中待排序数组对象
                        handleEditCollapseItem(info.selectedNodes[0].key.toString());
                      }}
                    />
                  </div>

                  <div>
                    {activeCollapseKey && (
                      <SortTree
                        title={activeCollapseKey}
                        treeData={sortArray}
                        checkedKeys={checkedNodesData[activeKey || '']?.[activeCollapseKey]}
                        onCheck={(checkedKeys, info) =>
                          handleSortTreeChecked(
                            info.checkedNodes.map((node) => node.key.toString()),
                          )
                        }
                      />
                    )}
                  </div>
                </TreeCarousel>
              </Card>
            ) : (
              <ResponseRaw value={rawResponseString} onSave={handleResponseRawSave} />
            )}
          </EditAreaPlaceholder>
        </Col>
      </Row>

      <Button type='primary' onClick={handleSave} style={{ float: 'right', marginTop: '16px' }}>
        Save
      </Button>
    </>
  );
};

export default NodesSort;
