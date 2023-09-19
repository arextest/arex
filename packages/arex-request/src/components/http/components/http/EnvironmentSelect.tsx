import { DeploymentUnitOutlined, EditOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, Select, SelectProps, Tooltip } from 'antd';
import { FC } from 'react';

const EnvironmentSelectWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-left: 1px solid ${(props) => props.theme.colorBorder};
  padding: 0 8px;
  .ant-select {
    width: 160px;
    height: 34px;
    margin-left: 0px;
    box-sizing: content-box;
    .ant-select-selector {
      height: 100%;
      .ant-select-selection-item {
        line-height: 34px;
      }
    }
  }
`;

const EnvironmentSelect: FC<SelectProps> = (props) => {
  return (
    <EnvironmentSelectWrapper>
      <Tooltip title={'Environment'} placement='left'>
        <DeploymentUnitOutlined />
      </Tooltip>

      <Select bordered={false} placeholder='Please select environment' {...props} />

      <Tooltip title={'Edit'}>
        <Button icon={<EditOutlined />} type='text' />
      </Tooltip>
    </EnvironmentSelectWrapper>
  );
};

export default EnvironmentSelect;
