import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Collapse, Typography } from 'antd';
import React, { FC, useMemo, useState } from 'react';

import ReplayService from '../../services/Replay.service';
import { infoItem } from '../../services/Replay.type';
import { EllipsisTooltip, SceneCode } from '../index';
import { EmptyWrapper } from '../styledComponents';
import DiffPathTooltip, { DiffPathTooltipProps } from './DiffPathTooltip';
import DiffPathViewer from './DiffPathViewer';

export interface DiffPathProps {
  mode?: DiffPathTooltipProps['mode'];
  appId: string;
  operationId: string;
  loading?: boolean;
  defaultOnlyFailed?: boolean;
  data: infoItem[];
}

const DiffPath: FC<DiffPathProps> = (props) => {
  const { mode = 'multiple', defaultOnlyFailed = true } = props;
  const [onlyFailed, setOnlyFailed] = React.useState(defaultOnlyFailed);

  const [searchOperationName, setSearchOperationName] = useState<string>();

  const {
    data: diffMsg,
    loading: loadingDiffMsg,
    run: queryDiffMsgById,
  } = useRequest(ReplayService.queryDiffMsgById, {
    manual: true,
  });

  const diffListFiltered = useMemo<infoItem[]>(() => {
    return props.data.filter((data) => {
      if (onlyFailed && !data.code) {
        return false;
      }
      if (searchOperationName) {
        return data.operationName.includes(searchOperationName);
      }
      return true;
    });
  }, [props.data, onlyFailed, searchOperationName]);

  return (
    <>
      <DiffPathTooltip
        mode={mode}
        count={diffListFiltered.length}
        onFilterChange={setOnlyFailed}
        onSearch={setSearchOperationName}
      />

      <EmptyWrapper loading={props.loading} empty={!diffListFiltered.length}>
        <Collapse
          accordion
          size='small'
          onChange={([id]) => {
            id && queryDiffMsgById({ id });
          }}
          css={css`
            .ant-collapse-content-box {
              padding: 0 !important;
            }
          `}
        >
          {diffListFiltered.map((data) => (
            <Collapse.Panel
              header={
                <Typography.Text strong>
                  <SceneCode code={data.code} />
                  <EllipsisTooltip title={data.operationName} />
                </Typography.Text>
              }
              key={data.id}
            >
              <DiffPathViewer
                defaultActiveFirst
                status={data.code}
                loading={loadingDiffMsg}
                appId={props.appId}
                operationId={props.operationId}
                height={'400px'}
                data={diffMsg}
              />
            </Collapse.Panel>
          ))}
        </Collapse>
      </EmptyWrapper>
    </>
  );
};

export default DiffPath;
