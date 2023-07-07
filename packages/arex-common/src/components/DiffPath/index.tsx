import { EllipsisTooltip, EmptyWrapper, PathHandler, SceneCode } from '@arextest/arex-core';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Collapse, Typography } from 'antd';
import React, { FC, useMemo, useState } from 'react';

import DiffPathTooltip, { DiffPathTooltipProps } from './DiffPathTooltip';
import { CompareResultDetail, DiffPathViewerProps } from './DiffPathViewer';
import DiffPathViewer from './DiffPathViewer';
import { infoItem } from './type';

export interface DiffPathProps extends Omit<DiffPathViewerProps, 'data'> {
  mode?: DiffPathTooltipProps['mode'];
  appId: string;
  operationId: string;
  loading?: boolean;
  extra?: React.ReactNode;
  defaultOnlyFailed?: boolean;
  requestDiffMsg: (params: any) => Promise<CompareResultDetail>;
  data: infoItem[];
  onIgnoreKey?: PathHandler;
  onGlobalIgnoreKey?: PathHandler;
  onSortKey?: PathHandler;
}

const DiffPath: FC<DiffPathProps> = (props) => {
  const { mode = 'multiple', defaultOnlyFailed = true } = props;
  const [onlyFailed, setOnlyFailed] = useState(defaultOnlyFailed);

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
          items={diffListFiltered.map((data) => ({
            key: data.id,
            label: (
              <Typography.Text strong>
                <SceneCode code={data.code} />
                <EllipsisTooltip title={data.operationName} />
              </Typography.Text>
            ),
            children: (
              <DiffPathViewer
                {...props}
                defaultActiveFirst
                height='400px'
                data={diffMsg}
                loading={loadingDiffMsg}
              />
            ),
          }))}
          onChange={([id]) => {
            id && queryDiffMsgById({ id });
          }}
          css={css`
            .ant-collapse-content-box {
              padding: 0 !important;
            }
          `}
        />
      </EmptyWrapper>
    </>
  );
};

export default DiffPath;