import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Collapse, Typography } from 'antd';
import React, { FC, useMemo, useState } from 'react';

import EllipsisTooltip from '../EllipsisTooltip';
import { DiffPathViewer, EmptyWrapper, SceneCode } from '../index';
import DiffPathTooltip, { DiffPathTooltipProps } from './DiffPathTooltip';
import { CompareResultDetail, DiffPathViewerProps } from './DiffPathViewer';
import { infoItem } from './type';

export interface DiffPathProps
  extends Pick<DiffPathViewerProps, 'requestQueryLogEntity' | 'requestIgnoreNode'> {
  mode?: DiffPathTooltipProps['mode'];
  appId: string;
  operationId: string;
  loading?: boolean;
  extra?: React.ReactNode;
  defaultOnlyFailed?: boolean;
  requestDiffMsg: (params: any) => Promise<CompareResultDetail>;
  data: infoItem[];
  onIgnoreKey?: (key: string[]) => void;
  onSortKey?: (key: string[]) => void;
}

const DiffPath: FC<DiffPathProps> = (props) => {
  const { mode = 'multiple', defaultOnlyFailed = true } = props;
  const [onlyFailed, setOnlyFailed] = React.useState(defaultOnlyFailed);

  const [searchOperationName, setSearchOperationName] = useState<string>();

  const {
    data: diffMsg,
    loading: loadingDiffMsg,
    run: queryDiffMsgById,
  } = useRequest(props.requestDiffMsg, {
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
        extra={props.extra}
        count={diffListFiltered.length}
        onFilterChange={setOnlyFailed}
        onSearch={setSearchOperationName}
      />

      <EmptyWrapper loading={props.loading} empty={!diffListFiltered.length}>
        <Collapse
          accordion
          size='small'
          // defaultActiveKey={diffListFiltered[0]?.id}
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
                height='400px'
                data={diffMsg}
                loading={loadingDiffMsg}
                appId={props.appId}
                operationId={props.operationId}
                onIgnoreKey={props.onIgnoreKey}
                onSortKey={props.onSortKey}
                requestIgnoreNode={props.requestIgnoreNode}
                requestQueryLogEntity={props.requestQueryLogEntity}
              />
            </Collapse.Panel>
          ))}
        </Collapse>
      </EmptyWrapper>
    </>
  );
};

export default DiffPath;
