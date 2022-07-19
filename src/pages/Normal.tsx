import { Tabs as Tabs } from "antd";

import { Collection, Http } from "../components";
import { findPathByKey } from "../components/Collection/util";
import { WorkSpace } from "../layout";
import { useStore } from "../store";
import { css } from "@emotion/react";
import { Theme } from "../style/theme";

const { TabPane } = Tabs;

const Normal = () => {
  const theme = useStore((state) => state.theme);
  const httpActiveKey = useStore((state) => state.httpActiveKey);
  const httpPanes = useStore((state) => state.httpPanes);
  const collectionTree = useStore((state) => state.collectionTree);
  const setHttpPanes = useStore((state) => state.setHttpPanes);
  const setHttpActiveKey = useStore((state) => state.setHttpActiveKey);

  // 标签栏操作
  const onChange = (newActiveKey: string) => {
    setHttpActiveKey(newActiveKey);
  };
  const add = () => {
    const randomKey = String(Math.random());
    const copyHttpPanes = JSON.parse(JSON.stringify(httpPanes));
    copyHttpPanes.push({ title: "New Request", key: randomKey, isNew: true });
    setHttpPanes(copyHttpPanes);
    setHttpActiveKey(randomKey);
  };

  const remove = (targetKey: string) => {
    const filterHttpPanes = JSON.parse(
      JSON.stringify(httpPanes.filter((panes) => panes.key !== targetKey))
    );
    setHttpPanes(filterHttpPanes);
    setHttpActiveKey(filterHttpPanes[0].key);
  };

  const onEdit = (targetKey: string, action: "add" | "remove") => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <WorkSpace
      Main={
        <Tabs
          type="editable-card"
          activeKey={httpActiveKey}
          onEdit={onEdit}
          onChange={onChange}
          size="small"
          tabPosition="top"
          tabBarGutter={-1}
          tabBarStyle={{ margin: "-15px -15px 16px -17px" }}
          css={css`
            .ant-tabs-nav-operations {
              margin: 0 0 0 0 !important;
              height: 36px;
              border-left: 1px solid
                ${theme === Theme.light
                  ? "rgba(0, 0, 0, 0.06)"
                  : "rgba(255, 255, 255, 0.06)"} !important;
            }
          `}
        >
          {httpPanes.map((httpPane: any) => {
            // 重要：
            // 根据key查询该节点对应的path数组
            const paths =
              findPathByKey(collectionTree, httpPane.key) ||
              [].map((i) => ({
                key: i.key,
                nodeType: i.nodeType,
              }));
            return (
              <TabPane
                tab={httpPane.title}
                key={httpPane.key}
                closable={httpPane.closable}
                style={{ height: "500px" }}
              >
                <Http id={httpPane.key} path={paths} isNew={httpPane.isNew} />
              </TabPane>
            );
          })}
        </Tabs>
      }
      Side={<Collection />}
    />
  );
};

export default Normal;
