import { Col, Row, Tabs } from "antd";
import { useMemo, useState } from "react";

import { Root, RootParadigmKey } from "../api/FileSystem.type";
import { Collection, Http } from "../components";
import { findPathByKey } from "../components/Collection/util";
import { collectionTreeToArr } from "../helpers/collection/util";
import { useStore } from "../store";
const { TabPane } = Tabs;

const Normal = () => {
  const httpActiveKey = useStore((state) => state.httpActiveKey);
  const httpPanes = useStore((state) => state.httpPanes);
  const collectionTree = useStore((state) => state.collectionTree);
  const setHttpPanes = useStore((state) => state.setHttpPanes);
  const setHttpActiveKey = useStore((state) => state.setHttpActiveKey);

  const theme = useStore((state) => state.theme);

  // 标签栏操作
  const onChange = (newActiveKey: string) => {
    setHttpActiveKey(newActiveKey);
  };
  const add = () => {
    const randomKey = String(Math.random())
    const copyHttpPanes = JSON.parse(JSON.stringify(httpPanes))
    copyHttpPanes.push({ title: 'New Request', key: randomKey })
    setHttpPanes(copyHttpPanes)
    setHttpActiveKey(randomKey)
  };

  const remove = (targetKey: string) => {
    const filterHttpPanes = JSON.parse(JSON.stringify(httpPanes.filter(panes => panes.key !== targetKey)))
    setHttpPanes(filterHttpPanes)
    setHttpActiveKey(filterHttpPanes[0].key)
  };

  const onEdit = (targetKey: string, action: 'add' | 'remove') => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <Row style={{ height: "100%" }}>
      <Col
        lg={{ span: 18 }}
        md={{ span: 16 }}
        style={{
          borderRight: `1px solid ${theme === "light" ? "#f0f0f0" : "#303030"}`,
          paddingRight: "14px",
          paddingTop: "14px",
        }}
      >
        <Tabs type="editable-card" activeKey={httpActiveKey} onEdit={onEdit} onChange={onChange}>
          {
            httpPanes.map((httpPane: any) => {
              // 重要：
              // 根据key查询该节点对应的path数组
              const paths = findPathByKey(collectionTree, httpPane.key)||[].map(i => ({
                key: i.key,
                nodeType: i.nodeType
              }))
              return <TabPane tab={httpPane.title} key={httpPane.key} closable={httpPane.closable}
                              style={{ height: '500px' }}>
                <Http id={httpPane.key} path={paths} />
              </TabPane>
            })
          }
        </Tabs>
      </Col>
      <Col lg={{ span: 6 }} md={{ span: 8 }}>
        <Collection />
      </Col>
    </Row>
  );
};

export default Normal;
