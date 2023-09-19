import { CopyOutlined, DeleteOutlined, FieldTimeOutlined, PlusOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, message, Tooltip } from 'antd';
import copy from 'copy-to-clipboard';
import { FC } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Updater } from 'use-immer';

// import { KeyValueType } from '../../../../services/FileSystem.type';
export type KeyValueType = {
  id: string;
  key: string;
  value: string;
  active: boolean;
};

export const FormHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  .ant-btn-sm {
    margin: 4px 0;
  }
  & > span:first-of-type {
    font-size: 13px;
    line-height: 32px;
    font-weight: 500;
    color: #9d9d9d;
  }
`;

const FormHeader: FC<{ update: Updater<KeyValueType[]>; title: string; dataSource: any }> = (
  props,
) => {
  const { t } = useTranslation();

  const handleAddParam = () => {
    const newValue: KeyValueType = {
      id: '',
      key: '',
      value: '',
      active: true,
    };
    props.update((state) => {
      state.push(newValue);
    });
  };

  // handleAddRecord
  const handleAddRecord = () => {
    const newValue: KeyValueType = {
      id: '',
      key: 'arex-force-record',
      value: 'true',
      active: true,
    };
    props.update((state) => {
      state.push(newValue);
    });
  };
  const handleClearAllParams = () => props.update([]);

  function copyUrl() {
    copy(JSON.stringify(props.dataSource.map((i: any) => ({ key: i.key, value: i.value }))));
    message.success('copy success🎉');
  }

  return (
    <FormHeaderWrapper>
      <span>{props.title}</span>
      <div>
        <Tooltip title={'Copy'}>
          <Button type='text' icon={<CopyOutlined />} onClick={copyUrl} />
        </Tooltip>
        <Tooltip title={t('record')}>
          <Button type='text' icon={<FieldTimeOutlined />} onClick={handleAddRecord} />
        </Tooltip>
        <Tooltip title={t('action.clear_all')}>
          <Button type='text' icon={<DeleteOutlined />} onClick={handleClearAllParams} />
        </Tooltip>
        <Tooltip title={t('add.new')}>
          <Button type='text' icon={<PlusOutlined />} onClick={handleAddParam} />
        </Tooltip>
      </div>
    </FormHeaderWrapper>
  );
};

export default FormHeader;
