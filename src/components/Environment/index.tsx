import { DashOutlined, DownOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Button, Empty, Input, Spin, Tooltip, Tree } from 'antd';
import { useRequest } from 'ahooks';
import type { DirectoryTreeProps } from 'antd/lib/tree';
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useStore } from '../../store';
import EnvironmentTitleRender from './EnvironmentTitleRender';
import EnvironmentService from '../../services/Environment.service';

export type Environmentprops = {
  workspaceId?: string;
  setEnvironmentSelectedData: (p: any) => void;
  fetchEnvironmentData: () => void;
  onSelect: (key: string, node: {}) => void;
};

const Environment = forwardRef(
  (
    {
      workspaceId,
      onSelect,
      activeKey,
      setEnvironmentSelectedData,
      fetchEnvironmentData,
    }: Environmentprops,
    ref,
  ) => {
    useImperativeHandle(ref, () => ({
      setSelectedKeys,
    }));
    const environmentTreeData = useStore((state) => state.environmentTreeData);
    const panes = useStore((state) => state.panes);
    const setActivePane = useStore((state) => state.setActivePane);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [titleRadius, setTitleRadius] = useState<string>('');

    const handleSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
      if (keys[0]) {
        setEnvironmentSelectedData(info.selectedNodes);
        setSelectedKeys(keys);
        onSelect &&
          onSelect(keys[0] as string, {
            title: info.node.envName,
            key: keys[0],
            pageType: 'environment',
            qid: keys[0],
            isNew: true,
            keyValues: info.node.keyValues,
          });
      }
    };
    useEffect(() => {
      setEnvironmentSelectedData(environmentTreeData?.filter((e) => e.id == activeKey));
      setSelectedKeys([activeKey]);
    }, [activeKey]);
    return (
      <div>
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            margin-bottom: 10px;
          `}
        >
          <Tooltip placement='bottomLeft' title={'Create New'} mouseEnterDelay={0.5}>
            <Button
              css={css`
                margin-right: 5px;
              `}
              icon={<PlusOutlined />}
              type='text'
              size='small'
              onClick={() => {
                const CreateEnvironment = {
                  env: { envName: 'New Environment', workspaceId, keyValues: [] },
                };
                EnvironmentService.saveEnvironment(CreateEnvironment).then((res) => {
                  if (res.body.success == true) {
                    fetchEnvironmentData();
                  }
                });
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
          fieldNames={{ title: 'envName', key: 'id' }}
          onMouseEnter={(e: any) => {
            setTitleRadius(e.node.id);
          }}
          onMouseLeave={() => {
            setTitleRadius('');
          }}
          onSelect={handleSelect}
          treeData={environmentTreeData}
          titleRender={(val) => (
            <EnvironmentTitleRender
              titleRadius={titleRadius}
              updateDirectorytreeData={() => {
                fetchEnvironmentData();
              }}
              val={val}
            />
          )}
        />
      </div>
    );
  },
);

export default Environment;
