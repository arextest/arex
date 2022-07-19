import AppHeader from "../components/app/Header";
import RequestPage from "../pages/request";
import {
  Button,
  Divider,
  Menu,
  Space,
  Tabs,
} from "antd";
import Collection from "../components/collection";
import Environment from "../components/environment";
import Login from "../components/login";
import {useEffect, useMemo, useState} from "react";
import { WorkspaceService } from "../services/WorkspaceService";
import { GlobalOutlined } from "@ant-design/icons";
import "./mainbox.less";
import { useMount } from "ahooks";
import { CollectionService } from "../services/CollectionService";
import ReplayPage from "../pages/replay";
import DraggableLayout from "./DraggableLayout";
import { NodeList } from "../vite-env";
import { collectionOriginalTreeToAntdTreeData } from "../helpers/collection/util";
import {useNavigate, useParams, useRoutes} from "react-router-dom";

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

const initialPanes = [
  {
    title: "Tab 1",
    content: "Content of Tab 1",
    closable: true,
    key: "1",
    paneType: "request",
    qid: "62b9a5e47e3ecb480e675a97",
  },
];


const MainBox = () => {
  const _useParams = useParams()
  const _useNavigate = useNavigate()
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
    CollectionService.listCollection({ id: _useParams.workspaceId }).then((res) => {
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
      title: newActiveKey,
      content: "Content of new Tab",
      key: newActiveKey,
      paneType: "replay",
      qid: "62b9a5e47e3ecb480e675a97",
    });
    setPanes(newPanes);
  };

  const remove = (targetKey: string) => {
    setPanes(panes.filter(i=>i.key !== targetKey))
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
  useMount(() => {

  });

  // 监听params
  useEffect(()=>{
    // 获取所有workspace
    WorkspaceService.listWorkspace()
        .then((workspaces) => {
          setWorkspaces(workspaces)
          if (_useParams.workspaceName && _useParams.workspaceId){
            fetchCollectionTreeData()
          } else {
            _useNavigate(`/${workspaces[0].id}/workspace/${workspaces[0].workspaceName}`)
          }
        });
    if (localStorage.getItem("email")) {
      setIslogin(true);
    } else {
      setIslogin(false);
    }
  },[_useParams])

  return (
    <>
    {!islogin ? <Login checkLoginStatus={checkLoginStatus}/> : (
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
                  <GlobalOutlined style={{ marginRight: "8px" }} />Canyon
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
                      fetchTreeData={()=>{fetchCollectionTreeData()}}
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
              <Tabs type="editable-card" onEdit={onEdit} activeKey={activeKey}>
                {panes.map(
                  (pane) => (
                    <TabPane
                      tab={pane.title}
                      key={pane.key}
                      closable={pane.closable}
                    >
                      {pane.paneType === "request" ? (
                        <RequestPage data={pane} collectionTreeData={collectionTreeData} />
                      ) : null}
                      {pane.paneType === "replay" ? (
                        <ReplayPage data={pane} />
                      ) : null}
                    </TabPane>
                  ),
                )}
              </Tabs>
            </div>
          </DraggableLayout>
        </div>
      </div>
    )}
    </>
  );
};
export default MainBox;
