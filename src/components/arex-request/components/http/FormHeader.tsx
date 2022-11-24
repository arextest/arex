// @ts-nocheck
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, Tooltip } from 'antd';
import { FC, useContext } from 'react';
import { Updater } from 'use-immer';

import { getValueByPath } from '../../helpers/utils/locale';
import { GlobalContext, HttpContext } from '../../index';

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

const FormHeader: FC<{ update: Updater<KeyValueType[]>; title: string }> = (props) => {
  const { store } = useContext(HttpContext);
  const { store: globalStore } = useContext(GlobalContext);
  const t = (key) => getValueByPath(globalStore.locale.locale, key);

  const handleAddParam = () => {
    const newValue: KeyValueType = {
      key: '',
      value: '',
      active: true,
      id: String(Math.random()),
    };
    props.update((state) => {
      state.push(newValue);
    });
  };

  const handleClearAllParams = () => props.update([]);

  return (
    <FormHeaderWrapper>
      <span>{props.title}</span>
      <div>
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
