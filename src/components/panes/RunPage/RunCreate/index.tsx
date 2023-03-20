import { css } from '@emotion/react';
import { message } from 'antd';
import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useCustomNavigate } from '../../../../router/useCustomNavigate';
import { batchCompareReportInitBatchCompareReport } from '../../../../services/batchcomparereport/initBatchCompareReport';
import { FileSystemService } from '../../../../services/FileSystem.service';
import {
  genCaseStructure,
  transformBatchCompareCaseList,
} from '../../BatchComparePage/hooks/useBatchCompareResults';
import ChooseRunType from './ChooseRunType';
import FolderTreeSelect, { FolderTreeSelectRef } from './FolderTreeSelect';

const RunCreatePane = () => {
  const params = useParams();
  const nav = useNavigate();
  const folderTreeSelectRef = useRef<FolderTreeSelectRef>(null);
  function onClickRunChooseRunType(runType: string) {
    const test: any = folderTreeSelectRef.current?.getBatchCompareReportParams();

    if (test.length > 0) {
      batchCompareReportInitBatchCompareReport({
        batchCompareCaseList: transformBatchCompareCaseList(test),
      }).then(({ planId }) => {
        nav(`/${params.workspaceId}/RunPage/${planId}`);
      });
    } else {
      message.error(`Please select case`);
    }
  }
  return (
    <div
      css={css`
        height: calc(100vh - 140px);
      `}
    >
      <div style={{ display: 'flex', height: '100%' }}>
        <FolderTreeSelect name={''} ref={folderTreeSelectRef} />
        <ChooseRunType onClickRun={onClickRunChooseRunType} name={''} />
      </div>
    </div>
  );
};

export default RunCreatePane;
