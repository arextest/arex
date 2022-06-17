import {useEffect, useState} from "react";
import Collection from "../components/Collection";
import {Col, Divider, Row, Select} from "antd";
import {useStore} from "../store";
const { Option } = Select;
const Header = () => {
  const [workspaceId, setWorkspaceId] = useState('');
  const workspaces = useStore((state) => state.workspaces)
  const currentWorkspaceId = useStore((state) => state.currentWorkspaceId)
  const setCurrentWorkspaceId = useStore((state) => state.setCurrentWorkspaceId)
  const handleChange = (value: string) => {
    setCurrentWorkspaceId(value)
  };

  useEffect(()=>{
    setCurrentWorkspaceId(workspaces[0]?.id)
  },[workspaces])

  return <div>
    <Row  style={{padding:'12px 12px 12px 12px'}}>
      <Col className="gutter-row" span={18} style={{lineHeight:'32px',fontWeight:'bolder'}}>
        AREX
      </Col>
      <Col className="gutter-row" span={6}>
        <div style={{textAlign:'right'}}>
          <Select value={currentWorkspaceId} placeholder={'请选择workspace'} style={{ width: 160 }} onChange={handleChange}>
            {
              workspaces.map((i,index)=>{
                return <Option key={index} value={i.id}>{i.workspaceName}</Option>
              })
            }
          </Select>
        </div>
      </Col>
    </Row>
    <Divider style={{margin:'0'}}/>
  </div>;
};

export default Header;
