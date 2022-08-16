import { MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Button, Input, Tooltip, Tree } from 'antd';
import type { DirectoryTreeProps } from 'antd/lib/tree';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import EnvironmentService from '../../services/Environment.service';
import { useStore } from '../../store';
import EnvironmentTitleRender from './EnvironmentTitleRender';

export type EnvironmentProps = {
  value?: string;
  onSelect: (key: string, node: {}) => void;
};

const Environment: FC<EnvironmentProps> = ({ value, onSelect }) => {
  const params = useParams();

  const selectedKeys = useMemo(() => (value ? [value] : []), [value]);
  const { environmentTreeData, setEnvironmentTreeData } = useStore();
  const [titleRadius, setTitleRadius] = useState<string>('');

  const handleSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
    if (keys.length) {
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

  const { run: fetchEnvironmentData } = useRequest(
    () => EnvironmentService.getEnvironment({ workspaceId: params.workspaceId as string }),
    {
      ready: !!params.workspaceId,
      refreshDeps: [params.workspaceId],
      onSuccess(res) {
        setEnvironmentTreeData(res);
      },
    },
  );

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
                env: { envName: 'New Environment', workspaceId: params.workspaceId, keyValues: [] },
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
};
export default Environment;
