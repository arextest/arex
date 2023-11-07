import { css, EllipsisTooltip, EmptyWrapper, SceneCode } from '@arextest/arex-core';
import { Collapse, Typography } from 'antd';
import React, { FC, useMemo, useState } from 'react';

import DiffPathTooltip, { DiffPathTooltipProps } from './DiffPathTooltip';
import { DiffPathViewerProps } from './DiffPathViewer';
import DiffPathViewer from './DiffPathViewer';
import { InfoItem } from './type';

export interface DiffPathProps extends Omit<DiffPathViewerProps, 'data' | 'id'> {
  mode?: DiffPathTooltipProps['mode'];
  operationId: string;
  loading?: boolean;
  extra?: React.ReactNode;
  itemsExtraRender?: (data: InfoItem) => React.ReactNode;
  defaultOnlyFailed?: boolean;
  data: InfoItem[];
}

const DiffPath: FC<DiffPathProps> = (props) => {
  const {
    data,
    loading,
    mode = 'multiple',
    defaultOnlyFailed = true,
    extra,
    itemsExtraRender,
    ...restProps
  } = props;
  const [onlyFailed, setOnlyFailed] = useState(defaultOnlyFailed);

  const [searchOperationName, setSearchOperationName] = useState<string>();

  const diffListFiltered = useMemo<InfoItem[]>(() => {
    return data.filter((data) => {
      if (onlyFailed && !data.code) {
        return false;
      }
      if (searchOperationName) {
        return data.operationName.includes(searchOperationName);
      }
      return true;
    });
  }, [data, onlyFailed, searchOperationName]);

  return (
    <>
      <DiffPathTooltip
        mode={mode}
        extra={extra}
        count={diffListFiltered.length}
        onFilterChange={setOnlyFailed}
        onSearch={setSearchOperationName}
      />

      <EmptyWrapper loading={loading} empty={!diffListFiltered.length}>
        <Collapse
          accordion
          destroyInactivePanel
          size='small'
          // defaultActiveKey={diffListFiltered[0]?.id}
          items={diffListFiltered.map((data) => ({
            key: data.id,
            label: (
              <Typography.Text strong>
                <SceneCode code={data.code} />
                <EllipsisTooltip title={data.operationName} />{' '}
                <Typography.Text strong type='secondary'>
                  [{data.categoryName}]
                </Typography.Text>
              </Typography.Text>
            ),
            extra: itemsExtraRender?.(data),
            children: (
              <DiffPathViewer {...restProps} defaultActiveFirst data={data} height='400px' />
            ),
          }))}
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
