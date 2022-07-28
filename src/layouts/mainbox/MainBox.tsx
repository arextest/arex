import './mainbox.less';

import { FileOutlined, GlobalOutlined, GoldOutlined } from '@ant-design/icons';
import { useMount } from 'ahooks';
import { Alert, Button, Divider, Menu, Space, Tabs } from 'antd';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useRoutes } from 'react-router-dom';

import AppHeader from '../../components/app/Header';
import Collection from '../../components/Collection';
import Environment from '../../components/environment';
import Login from '../../components/login';
import ReplayMenu from '../../components/Replay/ReplayMenu';
import { NodeType, PageType } from '../../constant';
import { collectionOriginalTreeToAntdTreeData, treeFind } from '../../helpers/collection/util';
import ReplayPage from '../../pages/replay';
import RequestPage from '../../pages/request';
import { CollectionService } from '../../services/CollectionService';
import { WorkspaceService } from '../../services/WorkspaceService';
import { NodeList } from '../../vite-env';
import DraggableLayout from '../DraggableLayout';
import PaneAreaEmpty from './Empty';

type PaneProps = {
  closable: boolean;
  title: string;
  key: string;
  pageType: PageType;
  qid: string;
  isNew: true;
  nodeType: NodeType;
};
import { GlobalContext } from '../../App';
import AppFooter from '../../components/app/Footer';
import FolderPage from '../../pages/folder';

const { TabPane } = Tabs;
// 静态数据
const userinfo = {
  email: 'tzhangm@trip.com',
  avatar: 'https://joeschmoe.io/api/v1/random',
};
const menuItems = [
  {
    key: 'collection',
    label: 'Collection',
    icon: <GlobalOutlined />,
    disabled: false,
  },
  {
    key: 'replay',
    label: 'Replay',
    icon: <FileOutlined />,
    disabled: false,
  },
  {
    key: 'environment',
    label: 'Environment',
    icon: <GoldOutlined />,
    disabled: true,
  },
];

const MainBox = () => {
  const _useParams = useParams();
  const _useNavigate = useNavigate();

  const value = useContext(GlobalContext);

  // *************侧边栏**************************
  const [siderMenuSelectedKey, setSiderMenuSelectedKey] = useState('collection');

  // *************workspaces**************************
  const [workspaces, setWorkspaces] = useState([]);

  // *************panes**************************
  const [panes, setPanes] = useState<PaneProps[]>([]);

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
  const [activeKey, setActiveKey] = useState('');
  const add = () => {
    const newActiveKey = String(Math.random());
    const newPanes = [...panes];
    newPanes.push({
      closable: true,
      title: 'New Request',
      key: newActiveKey,
      pageType: 'request',
      qid: newActiveKey,
      isNew: true,
      // 其实nodeType应该得通过qid拿到
      nodeType: 3,
    });
    setPanes(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: string) => {
    const f = panes.filter((i) => i.key !== targetKey);
    setPanes(f);

    if (f.length > 0) {
      setActiveKey(f[f.length - 1].key);
      updateChildState([f[f.length - 1].key]);
    } else {
      updateChildState([]);
    }
  };

  const onEdit: any = (targetKey: string, action: 'add' | 'remove') => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  // mount
  useMount(() => {});

  const childRef = useRef();
  const updateChildState = (keys) => {
    // changeVal就是子组件暴露给父组件的方法
    childRef.current.changeVal(keys);
  };

  // 监听params
  useEffect(() => {
    // 获取所有workspace
    if (localStorage.getItem('email')) {
      WorkspaceService.listWorkspace({
        userName: localStorage.getItem('email'),
      }).then((workspaces) => {
        setWorkspaces(workspaces);
        if (_useParams.workspaceName && _useParams.workspaceId) {
          fetchCollectionTreeData();
        } else {
          _useNavigate(`/${workspaces[0].id}/workspace/${workspaces[0].workspaceName}`);
        }
      });
    }
  }, [_useParams]);

  return (
    <>
      {!value.state.isLogin ? (
        <Login />
      ) : (
        <div className={'main-box'}>
          {/*AppHeader部分*/}
          <AppHeader userinfo={userinfo} workspaces={workspaces} />
          <Divider style={{ margin: '0' }} />
          <div>
            <DraggableLayout dir={'horizontal'}>
              {/*侧边栏*/}
              <div style={{ backgroundColor: 'white' }}>
                <Space
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px',
                  }}
                >
                  <div>
                    <GlobalOutlined style={{ marginRight: '8px' }} />
                    {_useParams.workspaceName}
                  </div>
                  <Space>
                    {/*<Button size={"small"} type="default">*/}
                    {/*  New*/}
                    {/*</Button>*/}
                    {/*<Button size={"small"} type="default">*/}
                    {/*  Import*/}
                    {/*</Button>*/}
                  </Space>
                </Space>
                <Divider style={{ margin: '0' }} />
                <div style={{ display: 'flex' }} className={'tool-table'}>
                  <Menu
                    className={'left-menu'}
                    mode='vertical'
                    items={menuItems}
                    selectedKeys={[siderMenuSelectedKey]}
                    onSelect={(val) => {
                      setSiderMenuSelectedKey(val.key);
                    }}
                  />
                  {/*flex布局需要overflow:'hidden'内部元素出滚动条*/}
                  <div style={{ flex: '1', overflow: 'hidden' }}>
                    <div
                      style={{
                        display: siderMenuSelectedKey === 'collection' ? 'block' : 'none',
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
                        cRef={childRef}
                      />
                    </div>
                    <div
                      style={{
                        display: siderMenuSelectedKey === 'environment' ? 'block' : 'none',
                      }}
                    >
                      <Environment />
                    </div>
                    <div
                      style={{
                        display: siderMenuSelectedKey === 'replay' ? 'block' : 'none',
                      }}
                    >
                      <ReplayMenu
                        onSelect={(app) => {
                          const newPanes = [...panes];
                          const f = newPanes.find((i) => i.key === app.appId);
                          if (!f) {
                            newPanes.push({
                              closable: true,
                              title: app.appId,
                              key: app.appId,
                              pageType: 'replay',
                              qid: app.appId,
                              isNew: true,
                              // 其实nodeType应该得通过qid拿到
                              curApp: app,
                            });
                            setPanes(newPanes);
                            setActiveKey(app.appId);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/*主区域*/}
              <div style={{ padding: '10px' }}>
                <Tabs
                  type='editable-card'
                  onEdit={onEdit}
                  activeKey={activeKey}
                  onChange={(_activeKey) => {
                    setActiveKey(_activeKey);
                  }}
                >
                  {panes.map((pane) => (
                    <TabPane
                      tab={
                        treeFind(collectionTreeData, (node) => node.key === pane.key)?.title ||
                        pane.title
                      }
                      key={pane.key}
                      closable={pane.closable}
                    >
                      {pane.pageType === 'request' || pane.pageType === 'case' ? (
                        <RequestPage
                          activateNewRequestInPane={(p) => {
                            fetchCollectionTreeData();

                            // const newActiveKey = String(Math.random());
                            // 关闭当前
                            const newPanes = [...panes.filter((i) => i.key !== activeKey)];
                            newPanes.push({
                              closable: true,
                              title: p.title,
                              key: p.key,
                              pageType: 'request',
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
                      {pane.pageType === 'replay' ? <ReplayPage data={pane} /> : null}
                      {pane.pageType === 'folder' ? <FolderPage /> : null}
                    </TabPane>
                  ))}
                </Tabs>
                {panes.length === 0 ? <PaneAreaEmpty add={add} /> : null}
              </div>
            </DraggableLayout>
          </div>
        </div>
      )}
      <AppFooter />
    </>
  );
};
export default MainBox;
