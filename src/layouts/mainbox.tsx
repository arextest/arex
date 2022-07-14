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
  { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
  { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
  {
    title: 'Tab 3',
    content: 'Content of Tab 3',
    key: '3',
    closable: false,
  },
];

const MainBox = () => {
  const [panes, setPanes] = useState(initialPanes);
  // 数据状态全部定义在这里

  // 集合Collection的状态
  const [siderMenuSelectedKey,setSiderMenuSelectedKey] = useState('collection')
  const [collectionTreeData,setCollectionTreeData] = useState([])
  const [collectionLoading,setCollectionLoading] = useState(false)
  const fetchCollectionData = ()=>{
    setCollectionLoading(true)
    WorkspaceService.queryWorkspacesByUser().then(res=>{
      setCollectionTreeData(res)
      setCollectionLoading(false)
    })
  }

  return (
    <div className={'main-box'}>
      {/*AppHeader部分*/}
      <AppHeader userinfo={userinfo} />
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
                <Collection treeData={collectionTreeData} loading={collectionLoading} fetchData={fetchCollectionData}/>
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
            <Tabs type="editable-card">
              {panes.map(pane => (
                  <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
                    {pane.content}
                  </TabPane>
              ))}
            </Tabs>
            <ComparePage />
            <RequestPage />
          </div>
        </Content>
      </Layout>
    </div>
  );
};
export default MainBox;
