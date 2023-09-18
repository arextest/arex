import { AimOutlined, DeploymentUnitOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ArexMenuFC,
  createArexMenu,
  SmallTextButton,
  SpaceBetweenWrapper,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest, useSize } from 'ahooks';
import { App, theme } from 'antd';
import React, { useMemo } from 'react';

import { MenuSelect } from '@/components';
import { MenusType, PanesType } from '@/constant';
import { EnvironmentService } from '@/services';
import { useEnvironments, useWorkspaces } from '@/store';
import { Environment } from '@/store/useEnvironments';

const EnvironmentMenu: ArexMenuFC = (props) => {
  const { t } = useTranslation(['common', 'components']);

  const { message } = App.useApp();
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const { activeEnvironment, timestamp, getEnvironments } = useEnvironments();
  const { activeWorkspaceId } = useWorkspaces();

  const size = useSize(() => document.getElementById('arex-menu-wrapper'));

  const selectedKeys = useMemo(() => (props.value ? [props.value] : []), [props.value]);

  const { run: createNewEnvironment } = useRequest(
    () =>
      EnvironmentService.saveEnvironment({
        env: {
          envName: 'New Environment',
          workspaceId: activeWorkspaceId,
          keyValues: [],
        },
      }),
    {
      manual: true,
      onSuccess(success) {
        if (success) {
          // TODO 目前 MenuSelect 通过传递request的方式在内部进行数据管理,
          //  导致 需要借助 timestamp 来强制刷新数据, 造成了两次相同的数据请求
          //  后续需要优化
          getEnvironments();
        } else {
          message.error(t('message.createFailed', { ns: 'common' }));
        }
      },
    },
  );

  return (
    <div style={{ padding: '8px' }}>
      <MenuSelect<Environment>
        small
        refresh
        rowKey='id'
        prefix={
          <SmallTextButton
            color={'primary'}
            icon={<PlusOutlined />}
            onClick={createNewEnvironment}
          />
        }
        initValue={props.value}
        selectedKeys={selectedKeys}
        onSelect={props.onSelect}
        placeholder={t('env.searchEnvironment', { ns: 'components' }) as string}
        request={() =>
          EnvironmentService.getEnvironments({ workspaceId: activeWorkspaceId as string })
        }
        requestOptions={{ refreshDeps: [timestamp, activeWorkspaceId] }}
        filter={(keyword, env) => env.envName?.includes(keyword)}
        itemRender={(env) => ({
          label: (
            <SpaceBetweenWrapper>
              {env.envName}
              {activeEnvironment?.id === env.id && <AimOutlined style={{ color: colorPrimary }} />}
            </SpaceBetweenWrapper>
          ),
          key: env.id,
        })}
        height={size && size?.height - 88}
        sx={{
          padding: '8px 0',
        }}
      />
    </div>
  );
};

export default createArexMenu(EnvironmentMenu, {
  type: MenusType.ENVIRONMENT,
  paneType: PanesType.ENVIRONMENT,
  icon: <DeploymentUnitOutlined />,
});
