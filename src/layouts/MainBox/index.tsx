import './index.less';

import { FileOutlined, GlobalOutlined, GoldOutlined } from '@ant-design/icons';
import { useMount } from 'ahooks';
import { Divider, Menu, Space, Tabs } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AppHeader, Collection, Environment, Login, Replay, ReplayMenu } from '../../components';
import { NodeType, PageTypeEnum } from '../../constant';
import { collectionOriginalTreeToAntdTreeData, treeFind } from '../../helpers/collection/util';
import { CollectionService } from '../../services/CollectionService';
import { WorkspaceService } from '../../services/WorkspaceService';
import { NodeList } from '../../vite-env';
import DraggableLayout from '../DraggableLayout';
import PaneAreaEmpty from './Empty';

type PaneProps = {
  closable: boolean;
  title: string;
  key: string;
  pageType: PageTypeEnum;
  qid: string;
  isNew: true;
  nodeType: NodeType;
};
import { GlobalContext } from '../../App';
import AppFooter from '../../components/app/Footer';
import HttpRequest, { HttpMode } from '../../components/Http';
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

const Index = () => {
  const _useParams = useParams();
  const _useNavigate = useNavigate();

  const { state: globalState } = useContext(GlobalContext);

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
      pageType: PageTypeEnum.Request,
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
      {!globalState.isLogin ? (
        <Login />
      ) : (
        <div className={'main-box'}>
          {/*AppHeader部分*/}
          <AppHeader userinfo={userinfo} workspaces={workspaces} />

          <Divider style={{ margin: '0' }} />

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
                      display: siderMenuSelectedKey === PageTypeEnum.Environment ? 'block' : 'none',
                    }}
                  >
                    <Environment />
                  </div>
                  <div
                    style={{
                      display: siderMenuSelectedKey === PageTypeEnum.Replay ? 'block' : 'none',
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
                            pageType: PageTypeEnum.Replay,
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
            <div>
              <Tabs
                size='small'
                type='editable-card'
                tabBarGutter={-1}
                onEdit={onEdit}
                activeKey={activeKey}
                onChange={(_activeKey) => {
                  setActiveKey(_activeKey);
                }}
                tabBarStyle={{
                  left: ' -11px',
                  top: ' -1px',
                }}
              >
                {panes.map((pane) => (
                  <TabPane
                    tab={
                      treeFind(collectionTreeData, (node) => node.key === pane.key)?.title ||
                      pane.title + pane.pageType
                    }
                    key={pane.key}
                    closable={pane.closable}
                  >
                    {pane.pageType === PageTypeEnum.Request && (
                      <HttpRequest
                        collectionTreeData={collectionTreeData}
                        mode={HttpMode.Normal}
                        id={pane.qid}
                        isNew={pane.isNew}
                        activateNewRequestInPane={(p) => {
                          fetchCollectionTreeData();
                          const newPanes = [...panes.filter((i) => i.key !== activeKey)];
                          newPanes.push({
                            isNew: true,
                            closable: true,
                            title: p.title,
                            key: p.key,
                            pageType: PageTypeEnum.Request,
                            qid: p.key,
                            // 其实nodeType应该得通过qid拿到
                            nodeType: 3,
                          });
                          setPanes(newPanes);
                          setActiveKey(p.key);
                        }}
                      />
                    )}
                    {pane.pageType === PageTypeEnum.Replay && <Replay curApp={pane.curApp} />}
                    {pane.pageType === PageTypeEnum.Folder && <FolderPage />}
                  </TabPane>
                ))}
              </Tabs>
              {!panes.length && <PaneAreaEmpty add={add} />}
            </div>
          </DraggableLayout>
        </div>
      )}
      <AppFooter />
    </>
  );
};
export default Index;
