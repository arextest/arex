import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useCustomNavigate } from '../../router/useCustomNavigate';
import { PagesType } from '../panes';
import { CaseDetailType } from '../panes/ReplayCaseDetailPage';
import { SmallTextButton } from '../styledComponents';

const ToRecordDetailButton: FC<{ caseInfo: CaseDetailType }> = ({ caseInfo }) => {
  const { t } = useTranslation('components');
  const params = useParams();
  const customNavigate = useCustomNavigate();
  const handleClickRecord = () => {
    customNavigate(
      `/${params.workspaceId}/${PagesType.ReplayCaseDetail}/${
        caseInfo.recordId
      }?data=${encodeURIComponent(JSON.stringify(caseInfo))}`,
    );
  };

  return (
    <SmallTextButton
      color='primary'
      key='CaseDetail'
      title={t('replay.recordDetail')}
      onClick={() => handleClickRecord()}
    />
  );
};
export default ToRecordDetailButton;
