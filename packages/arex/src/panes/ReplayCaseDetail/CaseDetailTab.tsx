import { DiffJsonView, useTranslation } from '@arextest/arex-core';
import { Button, Collapse, Descriptions, Modal } from 'antd';
import React, { FC, useState } from 'react';

import { RecordResult } from '@/services/ReportService';

type CaseDetailTabProps = {
  type: string;
  compareResults?: RecordResult[];
};

const CaseDetailTab: FC<CaseDetailTabProps> = (props) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentDetail, setCurrent] = useState<RecordResult>();
  const { t } = useTranslation('components');

  const handleClose = () => {
    setDetailOpen(false);
  };
  return (
    <>
      <Collapse
        items={props.compareResults?.map((result, index) => ({
          key: index,
          label: (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <span>{result.operationName}</span>
              <Button
                size='small'
                type='text'
                onClick={(e) => {
                  // avoid triggering collapse
                  e.stopPropagation();
                  setDetailOpen(true);
                  setCurrent(result);
                }}
              >
                {t('caseDetail.more')}
              </Button>
            </div>
          ),
          children: (
            <DiffJsonView
              height='400px'
              diffJson={{
                left: JSON.stringify(result.targetRequest?.body, null, 2),
                right: JSON.stringify(result.targetResponse?.body, null, 2),
              }}
            />
          ),
        }))}
        style={{ marginTop: '8px' }}
      />
      <Modal
        width='70vw'
        title={t('caseDetail.caseDetail')}
        open={detailOpen}
        footer={null}
        onCancel={handleClose}
      >
        <Descriptions bordered>
          <Descriptions.Item span={4} label={t('caseDetail.recordId')}>
            {currentDetail?.recordId}
          </Descriptions.Item>
          <Descriptions.Item span={4} label={t('caseDetail.operationName')}>
            {currentDetail?.operationName}
          </Descriptions.Item>
          <Descriptions.Item span={4} label={t('caseDetail.categoryType')}>
            {currentDetail?.categoryType.name}
          </Descriptions.Item>

          <Descriptions.Item span={4} label={t('caseDetail.recordVersion')}>
            {currentDetail?.recordVersion}
          </Descriptions.Item>

          <Descriptions.Item span={4} label={t('caseDetail.requestAttributes')}>
            <pre>{JSON.stringify(currentDetail?.targetRequest?.attributes, null, 2)}</pre>
          </Descriptions.Item>
          <Descriptions.Item span={4} label={t('caseDetail.requestBodyType')}>
            {currentDetail?.targetRequest?.type}
          </Descriptions.Item>

          <Descriptions.Item span={4} label={t('caseDetail.responseAttributes')}>
            <pre>{JSON.stringify(currentDetail?.targetResponse?.attributes, null, 2)}</pre>
          </Descriptions.Item>
          <Descriptions.Item span={4} label={t('caseDetail.responseBodyType')}>
            {currentDetail?.targetResponse?.type}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default CaseDetailTab;
