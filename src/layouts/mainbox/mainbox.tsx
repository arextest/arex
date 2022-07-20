import AppHeader from "../../components/app/Header";
import RequestPage from "../../pages/request";
import { Button, Divider, Menu, Space, Tabs } from "antd";
import Collection from "../../components/collection";
import Environment from "../../components/environment";
import Login from "../../components/login";
import { useEffect, useMemo, useState } from "react";
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

const { TabPane } = Tabs;
// 静态数据
const userinfo = {
  email: "tzhangm@trip.com",
  avatar: "https://joeschmoe.io/api/v1/random",
};
const items = [
  {
    key: "collection",
    label: "Collection",
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

const initialPanes = [];

const MainBox = () => {
  const _useParams = useParams();
  const _useNavigate = useNavigate();
  // *************登录状态**************************
  const [islogin, setIslogin] = useState<boolean>(true);

  // *************侧边栏**************************
  const [siderMenuSelectedKey, setSiderMenuSelectedKey] = useState(
    "collection",
  );

  // *************workspaces**************************
  const [workspaces, setWorkspaces] = useState([]);

  // *************panes**************************
  const [panes, setPanes] = useState(initialPanes);

  // *************collection**************************
  const [collectionTreeData, setCollectionTreeData] = useState<NodeList[]>([]);
  const [collectionLoading, setCollectionLoading] = useState(false);

  function fetchCollectionTreeData() {
    CollectionService.listCollection({ id: _useParams.workspaceId }).then((
      res,
    ) => {
      const roots = res?.data?.body?.fsTree?.roots || [];
      setCollectionTreeData(collectionOriginalTreeToAntdTreeData(roots));
    });
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
      //
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

  const checkLoginStatus = () => {
    if (localStorage.getItem("email")) {
      setIslogin(true);
    } else {
      setIslogin(false);
    }
  };

  // mount
  useMount(() => {});

  // 监听params
  useEffect(() => {
    // 获取所有workspace
    WorkspaceService.listWorkspace()
      .then((workspaces) => {
        setWorkspaces(workspaces);
        if (_useParams.workspaceName && _useParams.workspaceId) {
          fetchCollectionTreeData();
        } else {
          _useNavigate(
            `/${workspaces[0].id}/workspace/${workspaces[0].workspaceName}`,
          );
        }
      });
    if (localStorage.getItem("email")) {
      setIslogin(true);
    } else {
      setIslogin(false);
    }
  }, [_useParams]);

  return (
    <>
    {!islogin ? <Login checkLoginStatus={checkLoginStatus} /> : (
      <div className={"main-box"}>
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
                  <GlobalOutlined style={{ marginRight: "8px" }} />test
                </div>
                <Space>
                  <Button size={"small"} type="default">New</Button>
                  <Button size={"small"} type="default">Import</Button>
                </Space>
              </Space>
              <Divider style={{ margin: "0" }} />
              <div style={{ display: "flex" }} className={"tool-table"}>
                <Menu
                  mode="vertical"
                  items={items}
                  selectedKeys={[siderMenuSelectedKey]}
                  onSelect={(val) => {
                    setSiderMenuSelectedKey(val.key);
                  }}
                />
                <div>
                  <div
                    style={{
                      display:
                        siderMenuSelectedKey === "collection" ? "block" : "none",
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
                        siderMenuSelectedKey === "environment" ? "block" : "none",
                    }}
                  >
                    <Environment />
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
                {panes.map(
                  (pane) => (
                    <TabPane
                      tab={pane.title}
                      key={pane.key}
                      closable={pane.closable}
                    >
                      {(pane.pageType === "request"||pane.pageType === "case") ? (
                        <RequestPage
                          activateNewRequestInPane={(p) => {
                            console.log("终于传到我这里了", p);
                            fetchCollectionTreeData();

                            // const newActiveKey = String(Math.random());
                            // 关闭当前
                            const newPanes = [
                              ...(panes.filter((i) => i.key !== activeKey)),
                            ];
                            newPanes.push({
                              closable: true,
                              title: p.title,
                              key: p.key,
                              pageType: "request",
                              qid: p.key,
                              //
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
                  ),
                )}
              </Tabs>
              {panes.length === 0 ? (
                <PaneAreaEmpty add={add}></PaneAreaEmpty>
              ) : null}
            </div>
          </DraggableLayout>
        </div>
      </div>
    )}
    </>
  );
};
export default MainBox;
