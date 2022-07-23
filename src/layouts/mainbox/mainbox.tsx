import AppHeader from "../../components/app/Header";
import RequestPage from "../../pages/request";
import {Alert, Button, Divider, Menu, Space, Tabs} from "antd";
import Collection from "../../components/Collection";
import Environment from "../../components/environment";
import Login from "../../components/login";
import { useContext, useEffect, useMemo, useState } from "react";
import { WorkspaceService } from "../../services/WorkspaceService";
import { GlobalOutlined } from "@ant-design/icons";
import "./mainbox.less";
import { useMount } from "ahooks";
import { CollectionService } from "../../services/CollectionService";
import ReplayPage from "../../pages/replay";
import DraggableLayout from "../DraggableLayout";
import { NodeList } from "../../vite-env";
import {
  collectionOriginalTreeToAntdTreeData,
  treeFind,
} from "../../helpers/collection/util";
import { useNavigate, useParams, useRoutes } from "react-router-dom";
import PaneAreaEmpty from "./Empty";
import { NodeType, PageType } from "../../constant";
import ReplayMenu from "../../components/Replay/ReplayMenu";

type PaneProps = {
  closable: boolean;
  title: string;
  key: string;
  pageType: PageType;
  qid: string;
  isNew: true;
  nodeType: NodeType;
};
import { GlobalContext } from "../../App";
import AppFooter from "../../components/app/Footer";

const { TabPane } = Tabs;
// 静态数据
const userinfo = {
  email: "tzhangm@trip.com",
  avatar: "https://joeschmoe.io/api/v1/random",
};
const menuItems = [
  {
    key: "collection",
    label: "Collection",
    icon: <GlobalOutlined />,
    disabled: false,
  },
  {
    key: "replay",
    label: "Replay",
    icon: <GlobalOutlined />,
    disabled: false,
  },
  {
    key: "environment",
    label: "Environment",
    icon: <GlobalOutlined />,
    disabled: false,
  },
];

const MainBox = () => {
  const _useParams = useParams();
  const _useNavigate = useNavigate();

  const value = useContext(GlobalContext);

  // *************侧边栏**************************
  const [siderMenuSelectedKey, setSiderMenuSelectedKey] =
    useState("collection");

  // *************workspaces**************************
  const [workspaces, setWorkspaces] = useState([]);

  // *************panes**************************
  const [panes, setPanes] = useState<PaneProps[]>([]);

  // *************collection**************************
  const [collectionTreeData, setCollectionTreeData] = useState<NodeList[]>([]);
  const [collectionLoading, setCollectionLoading] = useState(false);

  function fetchCollectionTreeData() {
    CollectionService.listCollection({ id: _useParams.workspaceId }).then(
      (res) => {
        const roots = res?.data?.body?.fsTree?.roots || [];
        setCollectionTreeData(collectionOriginalTreeToAntdTreeData(roots));
      }
    );
  }

  // *tab相关
  const [activeKey, setActiveKey] = useState("");
  const add = () => {
    const newActiveKey = String(Math.random());
    const newPanes = [...panes];
    newPanes.push({
      closable: true,
      title: "New Request",
      key: newActiveKey,
      pageType: "request",
      qid: newActiveKey,
      isNew: true,
      // 其实nodeType应该得通过qid拿到
      nodeType: 3,
    });
    setPanes(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: string) => {
    setPanes(panes.filter((i) => i.key !== targetKey));
  };

  const onEdit: any = (targetKey: string, action: "add" | "remove") => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  // mount
  useMount(() => {});

  // 监听params
  useEffect(() => {
    // 获取所有workspace
    console.log(localStorage.getItem("email"));
    if (localStorage.getItem("email")) {
      WorkspaceService.listWorkspace({
        userName: localStorage.getItem("email"),
      }).then((workspaces) => {
        setWorkspaces(workspaces);
        if (_useParams.workspaceName && _useParams.workspaceId) {
          fetchCollectionTreeData();
        } else {
          _useNavigate(
            `/${workspaces[0].id}/workspace/${workspaces[0].workspaceName}`
          );
        }
      });
    }
  }, [_useParams]);

  return (
    <>
      {!value.state.isLogin ? (
        <Login />
      ) : (
        <div className={"main-box"}>
          {
            window.__AREX_EXTENSION_INSTALLED__?null:<Alert message={'注意：Chrome插件可突破浏览器跨域限制，请先安装Chrome插件后再运行。'}/>
          }

          {/*AppHeader部分*/}
          <AppHeader userinfo={userinfo} workspaces={workspaces} />
          <Divider style={{ margin: "0" }} />
          <div>
            <DraggableLayout dir={"horizontal"}>
              {/*侧边栏*/}
              <div style={{ backgroundColor: "white" }}>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px",
                  }}
                >
                  <div>
                    <GlobalOutlined style={{ marginRight: "8px" }} />
                    {_useParams.workspaceName}
                  </div>
                  <Space>
                    <Button size={"small"} type="default">
                      New
                    </Button>
                    <Button size={"small"} type="default">
                      Import
                    </Button>
                  </Space>
                </Space>
                <Divider style={{ margin: "0" }} />
                <div style={{ display: "flex" }} className={"tool-table"}>
                  <Menu
                    mode="vertical"
                    items={menuItems}
                    selectedKeys={[siderMenuSelectedKey]}
                    onSelect={(val) => {
                      setSiderMenuSelectedKey(val.key);
                    }}
                  />
                  <div>
                    <div
                      style={{
                        display:
                          siderMenuSelectedKey === "collection"
                            ? "block"
                            : "none",
                      }}
                    >
                      <Collection
                        treeData={collectionTreeData}
                        setMainBoxPanes={setPanes}
                        mainBoxPanes={panes}
                        setMainBoxActiveKey={setActiveKey}
                        loading={collectionLoading}
                        fetchTreeData={() => {
                          fetchCollectionTreeData();
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display:
                          siderMenuSelectedKey === "environment"
                            ? "block"
                            : "none",
                      }}
                    >
                      <Environment />
                    </div>

                    <div
                      style={{
                        display:
                          siderMenuSelectedKey === "replay" ? "block" : "none",
                      }}
                    >
                      <ReplayMenu
                        onSelect={(app) => {
                          console.log(app);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/*主区域*/}
              <div style={{ padding: "10px" }}>
                <Tabs
                  type="editable-card"
                  onEdit={onEdit}
                  activeKey={activeKey}
                  onChange={(_activeKey) => {
                    console.log(_activeKey);
                    setActiveKey(_activeKey);
                  }}
                >
                  {panes.map((pane) => (
                    <TabPane
                      tab={pane.title}
                      key={pane.key}
                      closable={pane.closable}
                    >
                      {pane.pageType === "request" ||
                      pane.pageType === "case" ? (
                        <RequestPage
                          activateNewRequestInPane={(p) => {
                            console.log("终于传到我这里了", p);
                            fetchCollectionTreeData();

                            // const newActiveKey = String(Math.random());
                            // 关闭当前
                            const newPanes = [
                              ...panes.filter((i) => i.key !== activeKey),
                            ];
                            newPanes.push({
                              closable: true,
                              title: p.title,
                              key: p.key,
                              pageType: "request",
                              qid: p.key,
                              // 其实nodeType应该得通过qid拿到
                              nodeType: 3,
                            });
                            // setPanes(newPanes);
                            setPanes(newPanes);
                            setActiveKey(p.key);
                          }}
                          data={pane}
                          collectionTreeData={collectionTreeData}
                        />
                      ) : null}
                      {pane.pageType === "replay" ? (
                        <ReplayPage data={pane} />
                      ) : null}
                    </TabPane>
                  ))}
                </Tabs>
                {panes.length === 0 ? <PaneAreaEmpty add={add} /> : null}
              </div>
            </DraggableLayout>
          </div>
        </div>
      )}
      <AppFooter></AppFooter>
    </>
  );
};
export default MainBox;
