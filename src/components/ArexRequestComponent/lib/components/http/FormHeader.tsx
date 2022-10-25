import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, Tooltip } from 'antd';
import { FC, useContext } from 'react';
import { Updater } from 'use-immer';
import { HttpContext } from '../../index';
import { getValueByPath } from '../../helpers/utils/locale';

export type KeyValueType = {
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

const FormHeader: FC<{ update: Updater<KeyValueType[]> }> = (props) => {
  const { store } = useContext(HttpContext);
  const t = (key) => getValueByPath(store.locale, key);

  const handleAddParam = () => {
    const newValue: KeyValueType = {
      key: '',
      value: '',
      active: true,
    };
    props.update((state) => {
      state.push(newValue);
    });
  };

  const handleClearAllParams = () => props.update([]);

  return (
    <FormHeaderWrapper>
      <span>{t('request.parameter_list')}</span>
      <div>
        <Tooltip title={t('help')}>
          <Button type='text' icon={<QuestionCircleOutlined />} />
        </Tooltip>
        <Tooltip title={t('clearAll')}>
          <Button type='text' icon={<DeleteOutlined />} onClick={handleClearAllParams} />
        </Tooltip>
        <Tooltip title={t('batchEdit')}>
          <Button type='text' icon={<EditOutlined />} />
        </Tooltip>
        <Tooltip title={t('add')}>
          <Button type='text' icon={<PlusOutlined />} onClick={handleAddParam} />
        </Tooltip>
      </div>
    </FormHeaderWrapper>
  );
};

export default FormHeader;
