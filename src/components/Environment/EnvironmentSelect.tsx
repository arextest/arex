import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Select } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

import { EnvironmentKey } from '../../constant';
import { getLocalStorage } from '../../helpers/utils';
import EnvironmentService from '../../services/Environment.service';
import { useStore } from '../../store';

const { Option } = Select;

const EnvironmentSelectWrapper = styled.div`
  .ant-select {
    height: 36px;
    width: 160px;
    box-sizing: content-box;
    border-left: 1px solid ${(props) => props.theme.colorBorderSecondary};
    margin-left: -1px;
    .ant-select-selector {
      height: 100%;
      .ant-select-selection-item {
        line-height: 34px;
      }
    }
  }
`;

const EnvironmentSelect = () => {
  const params = useParams();
  const { currentEnvironment, setCurrentEnvironment, environmentTreeData, setEnvironmentTreeData } =
    useStore();

  useRequest(
    () =>
      EnvironmentService.getEnvironment({
        workspaceId: params.workspaceId as string,
      }),
    {
      ready: !!params.workspaceId,
      refreshDeps: [params.workspaceId],
      onSuccess(res) {
        setEnvironmentTreeData(res);

        const environmentKey = getLocalStorage<string>(EnvironmentKey);
        environmentKey && setCurrentEnvironment(environmentKey);
      },
    },
  );
  return (
    <EnvironmentSelectWrapper id='environment-select'>
      <Select
        bordered={false}
        value={currentEnvironment?.id}
        getPopupContainer={() => document.getElementById('environment-select') as HTMLElement}
        onChange={setCurrentEnvironment}
      >
        <Option value='0'>No Environment</Option>
        {environmentTreeData?.map((e) => (
          <Option key={e.id} value={e.id}>
            {e.envName}
          </Option>
        ))}
      </Select>
    </EnvironmentSelectWrapper>
  );
};

export default EnvironmentSelect;
