import { css } from '@emotion/react';
import { Collapse, Typography } from 'antd';
import React, { FC, useMemo, useState } from 'react';

import EllipsisTooltip from '../EllipsisTooltip';
import { CheckOrCloseIcon, DiffPathViewer, EmptyWrapper } from '../index';
import DiffPathTooltip, { DiffPathTooltipProps } from './DiffPathTooltip';
import { CompareResultDetail, DiffPathViewerProps } from './DiffPathViewer';

export interface DiffPathProps
  extends Pick<DiffPathViewerProps, 'onQueryLogEntity' | 'onIgnoreNode'> {
  mode?: DiffPathTooltipProps['mode'];
  appId: string;
  operationId: string;
  loading?: boolean;
  defaultOnlyFailed?: boolean;
  data: CompareResultDetail[];
}

const DiffPath: FC<DiffPathProps> = (props) => {
  const { mode = 'multiple', defaultOnlyFailed = true } = props;
  const [onlyFailed, setOnlyFailed] = React.useState(defaultOnlyFailed);

  const [searchOperationName, setSearchOperationName] = useState<string>();

  const diffListFiltered = useMemo<CompareResultDetail[]>(() => {
    return props.data.filter((data) => {
      if (onlyFailed && !data.diffResultCode) {
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
          defaultActiveKey={diffListFiltered[0]?.id}
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
                  {/*<Label>{props.data.categoryName}</Label>*/}
                  <CheckOrCloseIcon size={12} checked={!data.diffResultCode}></CheckOrCloseIcon>
                  <EllipsisTooltip title={data.operationName} />
                </Typography.Text>
              }
              key={data.id}
            >
              <DiffPathViewer
                defaultActiveFirst
                height='400px'
                data={data}
                appId={props.appId}
                operationId={props.operationId}
                onIgnoreNode={props.onIgnoreNode}
                onQueryLogEntity={props.onQueryLogEntity}
              />
            </Collapse.Panel>
          ))}
        </Collapse>
      </EmptyWrapper>
    </>
  );
};

export default DiffPath;
