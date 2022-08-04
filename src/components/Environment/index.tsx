import { Button, Empty, Input, Spin, Tooltip, Tree } from 'antd';
import { css } from '@emotion/react';
import { DashOutlined, DownOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import  EnvironmentTitleRender  from './EnvironmentTitleRender'
import { useEffect, useState } from 'react';
import type { DirectoryTreeProps } from 'antd/lib/tree';


export type Environmentprops = {
  activePane: () => void;
  EnvironmentData: []|undefined;
  setMainBoxPanes: (p: any) => void;
  mainBoxPanes: any[];
  setMainBoxActiveKey: (p: any) => void;
  activeKey:string;
  setEnvironmentSelectedData:(p: any) => void;
  fetchEnvironmentDatas:() => void;
  nowEnvironment:string;
  setCurEnvironment:(p: any) => void;
};

const Environment = ({ setCurEnvironment,activePane,EnvironmentData,setMainBoxPanes,mainBoxPanes,setMainBoxActiveKey,activeKey,setEnvironmentSelectedData,fetchEnvironmentDatas,nowEnvironment }:Environmentprops) => {
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [titleRadius,setTitleRadius]=useState<string>('');
  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
    if (keys.length > 0) {
      setSelectedKeys(keys);
    }
    
    if (
      keys[0] &&
      !mainBoxPanes.map((i) => i.key).includes(keys[0])
    ) {
      const newPanes = [...mainBoxPanes];
      newPanes.push({
        title: info.node.envName,
        key: keys[0],
        pageType: 'environment',
        qid: keys[0],
        isNew: true,
        keyValues: info.node.keyValues,
      });
      setMainBoxPanes(newPanes);
    }
    if (keys[0]) {
      setMainBoxActiveKey(keys[0]);
    }
  }
  useEffect(()=>{
    setEnvironmentSelectedData(EnvironmentData?.filter(e=>e.id==activeKey))
    setSelectedKeys([activeKey]);
  },[activeKey])
  return (
    <div>
      <div css={css`
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            margin-bottom: 10px;
          `}>
          <Tooltip placement='bottomLeft' title={'Create New'} mouseEnterDelay={0.5}>
            <Button
              css={css`
              margin-right: 5px;
            `}
              icon={<PlusOutlined />}
              type='text'
              size='small'
              onClick={() => {
                activePane();
              }}
            />
          </Tooltip>
          <Input
            disabled={true}
            className={'environment-header-search'}
            size='small'
            placeholder=''
            prefix={<MenuOutlined />}
          />
        </div>
        <Tree
        blockNode={true}
        selectedKeys={selectedKeys}
        fieldNames={{title:'envName',key:'id'}}
        onMouseEnter={(e:any)=>{
          setTitleRadius(e.node.id);
        }}
        onMouseLeave={()=>{
          setTitleRadius('');
        }}
        onSelect={onSelect}
        treeData={EnvironmentData}
        titleRender={(val) => (
          <EnvironmentTitleRender
            titleRadius={titleRadius}
            updateDirectorytreeData={()=>{fetchEnvironmentDatas()}}
            val={val}
            nowEnvironment={nowEnvironment}
            setNowEnvironment={setCurEnvironment}
          />
        )}
      />
    </div>
  );
};

export default Environment;
