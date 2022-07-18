import AppHeader from "../components/app/Header";
import ComparePage from "../pages/compare";
import RequestPage from "../pages/request";
import {Button, Col, Divider, Layout, Menu, Popconfirm, Row, Space, Spin, Tabs} from "antd";
import MenuItem from "antd/es/menu/MenuItem";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import Collection from "../components/collection";
import Environment from "../components/environment";
import {useEffect, useState} from "react";
import { WorkspaceService} from "../services/WorkspaceService";
import {GlobalOutlined} from "@ant-design/icons";
import './mainbox.less'
import {useMount} from "ahooks";
import {CollectionService} from "../services/CollectionService";

const { TabPane } = Tabs;
// 静态数据
const userinfo = {
  email:'tzhangm@trip.com',
  avatar: 'https://joeschmoe.io/api/v1/random'
}
const items: MenuItem[] = [
  {
    key: "collection",
    label: "Collection",
    icon:<GlobalOutlined />,
    disabled: false,
  },
  {
    key: "environment",
    label: "Environment",
    icon:<GlobalOutlined />,
    disabled: false,
  },
];

const initialPanes = [
  {
    title: 'Tab 1',
    content: 'Content of Tab 1',
    closable:true,
    key: '1',
    paneType:'request',
    qid:'62b9a5e47e3ecb480e675a97'
  },
];

const MainBox = () => {
  // workspaces 数据
  const [workspaces,setWorkspaces] = useState([])
  const [panes, setPanes] = useState(initialPanes);
  const [currentWorkspaceId,setcurrentWorkspaceId]= useState('')
  // 数据状态全部定义在这里

  // 集合Collection的状态
  const [siderMenuSelectedKey,setSiderMenuSelectedKey] = useState('collection')
  const [collectionLoading,setCollectionLoading] = useState(false)
  const fetchCollectionData = ()=>{
  }

  const add = () => {
    console.log('123')
    const newActiveKey = String(Math.random());
    const newPanes = [...panes];
    newPanes.push({ title: newActiveKey, content: 'Content of new Tab', key: newActiveKey });
    setPanes(newPanes);
    // setActiveKey(newActiveKey);
  };

  const remove = (targetKey: string) => {
  };

  const onEdit = (targetKey: string, action: 'add' | 'remove') => {
    console.log(targetKey,action)
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };


  // const [WorkspaceService] = useState([])

  useMount(()=>{
    // 获取所有workspace
    WorkspaceService.listWorkspace().then(res=>{
      setcurrentWorkspaceId(res.data.body.workspaces[0].id)
      setWorkspaces(res.data.body.workspaces)
    })
  })

  return (
    <div className={'main-box'}>
      {/*AppHeader部分*/}
      <AppHeader userinfo={userinfo} workspaces={workspaces} />
      <Divider style={{margin:'0'}}/>
      <Layout>
        {/*侧边栏*/}
        <Sider style={{ backgroundColor: "white" }} width={400}>
          <Space style={{ display: "flex", justifyContent: "space-between",padding:'10px' }}>
            <div><GlobalOutlined />Canyon</div>
            <Space>
              <Button type="default">New</Button>
              <Button type="default">Import</Button>
            </Space>
          </Space>
          <Divider style={{margin:'0'}}/>
          <div style={{ display: "flex" }} className={'tool-table'}>
            <Menu mode="vertical" items={items} selectedKeys={[siderMenuSelectedKey]} onSelect={(val)=>{
              setSiderMenuSelectedKey(val.key)
            }} />
            <div>
              <div style={{display:siderMenuSelectedKey==='collection'?'block':'none'}}>
                <Collection currentWorkspaceId={currentWorkspaceId} loading={collectionLoading} fetchData={fetchCollectionData}/>
              </div>
              <div style={{display:siderMenuSelectedKey==='environment'?'block':'none'}}>
                <Environment/>
              </div>
            </div>
          </div>
        </Sider>
        {/*主区域*/}
        <Content>
          <div>
            <Tabs type="editable-card" onEdit={onEdit}>
              {panes.map(pane => (
                  <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
                    {
                      pane.paneType === 'request'?<RequestPage data={pane} />:null
                    }
                    {/*{*/}
                    {/*  pane.paneType === 'report'?<ReportPage data={pane} />:null*/}
                    {/*}*/}
                  </TabPane>
              ))}
            </Tabs>
            {/*<ComparePage />*/}
          </div>
        </Content>
      </Layout>
    </div>
  );
};
export default MainBox;
