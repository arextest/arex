import styled from "@emotion/styled";
import { Tabs } from "antd";
import { TabsProps } from "antd/lib/tabs";

import { Root, RootParadigmKey } from "../api/FileSystem.type";
import { Collection, Http } from "../components";
import { findPathByKey } from "../components/Collection/util";
import { WorkSpace } from "../layout";
import { useStore } from "../store";
import { Theme } from "../style/theme";

const { TabPane } = Tabs;
const MainTabs = styled((props: TabsProps) => (
  <Tabs
    size="small"
    type="editable-card"
    tabPosition="top"
    tabBarGutter={-1}
    tabBarStyle={{ margin: "-15px -15px 16px -17px" }}
    {...props}
  />
))<{ theme: Theme & TabsProps }>`
  .ant-tabs-nav-operations {
    margin: 0 0 0 0 !important;
    height: 36px;
    border-left: 1px solid
      ${(props) =>
        props.theme === Theme.light
          ? "rgba(0, 0, 0, 0.06)"
          : "rgba(255, 255, 255, 0.06)"} !important;
  }
`;

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

  const onEdit: TabsProps["onEdit"] = (targetKey, action) => {
    action === "add" ? add() : remove(targetKey as string);
  };

  return (
    <WorkSpace
      Main={
        <MainTabs
          theme={theme}
          activeKey={httpActiveKey}
          onEdit={onEdit}
          onChange={onChange}
        >
          {httpPanes.map((httpPane) => {
            // 重要：
            // 根据key查询该节点对应的path数组
            const paths =
              findPathByKey(collectionTree, httpPane.key) ||
              ([] as Root<RootParadigmKey>[]);
            return (
              <TabPane
                tab={httpPane.title}
                key={httpPane.key}
                closable={httpPane.closable}
              >
                <Http id={httpPane.key} path={paths} isNew={httpPane.isNew} />
              </TabPane>
            );
          })}
        </MainTabs>
      }
      Side={<Collection />}
    />
  );
};

export default Normal;
