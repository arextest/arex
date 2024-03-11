import { CopyOutlined, DeleteOutlined, FieldTimeOutlined, PlusOutlined } from '@ant-design/icons';
import { copyToClipboard, SpaceBetweenWrapper, TooltipButton } from '@arextest/arex-core';
import { Alert, App, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useArexRequestStore } from '../../hooks';
import HeadersTable, { HeaderData } from '../HeadersTable';

const RequestHeaders = () => {
  const { message } = App.useApp();
  const { store, dispatch } = useArexRequestStore();

  const handleEditHeader = (header: HeaderData | HeaderData[] | undefined = []) => {
    dispatch((state) => {
      if (Array.isArray(header)) state.request.headers = header;
      else state.request.headers.push(header);
    });
  };

  const { t } = useTranslation();

  const handleAddParam = () => {
    const record: HeaderData = {
      id: String(Math.random()),
      key: '',
      value: '',
      active: true,
    };
    handleEditHeader(record);
  };

  const handleAddRecord = () => {
    const record: HeaderData = {
      id: String(Math.random()),
      key: 'arex-force-record',
      value: 'true',
      active: true,
    };
    handleEditHeader(record);
  };

  const copyUrl = () => {
    copyToClipboard(
      JSON.stringify(
        store.request.headers
          .filter((header) => header.active)
          .map(({ key, value }) => ({ key, value })),
        null,
        2,
      ),
    );
    message.success('copy success🎉');
  };

  return (
    <>
      <SpaceBetweenWrapper>
        <Typography.Text type='secondary'> {t('request.headers')}</Typography.Text>
        <div>
          <TooltipButton title={'Copy'} icon={<CopyOutlined />} onClick={copyUrl} />
          <TooltipButton
            title={t('record')}
            icon={<FieldTimeOutlined />}
            onClick={handleAddRecord}
          />
          <TooltipButton
            title={t('action.clear_all')}
            icon={<DeleteOutlined />}
            onClick={() => handleEditHeader()}
          />
          <TooltipButton title={t('add.new')} icon={<PlusOutlined />} onClick={handleAddParam} />
        </div>
      </SpaceBetweenWrapper>
      {store.request.headers.map(({ key }) => key.toLowerCase()).includes('cookie') ? (
        <Alert message={t('tab.cookie_tip')} type='warning' showIcon closable />
      ) : null}
      <HeadersTable
        editable
        size='small'
        rowKey='id'
        pagination={false}
        dataSource={store.request.headers}
        onEdit={handleEditHeader}
      />
    </>
  );
};

export default RequestHeaders;
