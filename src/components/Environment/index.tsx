import { DashOutlined, DownOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Button, Empty, Input, Spin, Tooltip, Tree } from 'antd';
import type { DirectoryTreeProps } from 'antd/lib/tree';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import EnvironmentService from '../../services/Environment.service';
import { useStore } from '../../store';
import EnvironmentTitleRender from './EnvironmentTitleRender';

export type Environmentprops = {
  workspaceId?: string;
  // activePane: () => void;
  // EnvironmentData: [] | undefined;
  setMainBoxPanes: (p: any) => void;
  mainBoxPanes: any[];
  setMainBoxActiveKey: (p: any) => void;
  activeKey: string;
  setEnvironmentSelectedData: (p: any) => void;
  // fetchEnvironmentDatas: () => void;
  nowEnvironment: string;
  setCurEnvironment: (p: any) => void;
  onSelect: (key: string, node: {}) => void;
};

const Environment = forwardRef(
  (
    {
      workspaceId,
      onSelect,
      setCurEnvironment,
      activeKey,
      setEnvironmentSelectedData,
      // fetchEnvironmentDatas,
      nowEnvironment,
    }: Environmentprops,
    ref,
  ) => {
    useImperativeHandle(ref, () => ({
      setSelectedKeys,
    }));
    const setEnvironmentTreeData = useStore((state) => state.setEnvironmentTreeData);
    const setPanes = useStore((state) => state.setPanes);
    const panes = useStore((state) => state.panes);
    const setActivePane = useStore((state) => state.setActivePane);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [titleRadius, setTitleRadius] = useState<string>('');
    const { data: EnvironmentData = [], run: fetchEnvironmentData } = useRequest(
      () => EnvironmentService.getEnvironment({ workspaceId: workspaceId as string }),
      {
        ready: !!workspaceId,
        refreshDeps: [workspaceId],
      },
    );

    useEffect(() => {
      if (EnvironmentData.length > 0) {
        setEnvironmentTreeData(EnvironmentData);
      }
    }, [EnvironmentData]);

    const handleSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
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
    };
    useEffect(() => {
      setEnvironmentSelectedData(EnvironmentData?.filter((e) => e.id == activeKey));
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
          treeData={EnvironmentData}
          titleRender={(val) => (
            <EnvironmentTitleRender
              titleRadius={titleRadius}
              updateDirectorytreeData={() => {
                fetchEnvironmentData();
              }}
              val={val}
              nowEnvironment={nowEnvironment}
              setNowEnvironment={setCurEnvironment}
            />
          )}
        />
      </div>
    );
  },
);

export default Environment;
