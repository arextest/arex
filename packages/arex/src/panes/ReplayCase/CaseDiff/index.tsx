import {
  css,
  EllipsisTooltip,
  EmptyWrapper,
  HoveredActionButton,
  SceneCode,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Collapse, CollapseProps, Flex, Typography } from 'antd';
import React, { FC, useMemo, useState } from 'react';

import { ComparisonService } from '@/services';
import { IgnoreCategory } from '@/services/ComparisonService';
import { InfoItem } from '@/services/ReportService';

import CaseDiffTooltip, { DiffPathTooltipProps } from './CaseDiffTooltip';
import { DiffPathViewerProps } from './CaseDiffViewer';
import CaseDiffViewer from './CaseDiffViewer';

export interface DiffPathProps extends Omit<DiffPathViewerProps, 'data' | 'id'> {
  appId: string;
  operationId: string;
  mode?: DiffPathTooltipProps['mode'];
  loading?: boolean;
  extra?: React.ReactNode;
  itemsExtraRender?: (data: InfoItem) => React.ReactNode;
  defaultOnlyFailed?: boolean;
  data: InfoItem[];
}

const CaseDiff: FC<DiffPathProps> = (props) => {
  const {
    data,
    loading,
    mode = 'multiple',
    defaultOnlyFailed = true,
    extra,
    itemsExtraRender,
    ...restProps
  } = props;

  const { message } = App.useApp();
  const { t } = useTranslation('components');

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

  const { run: insertIgnoreCategory } = useRequest(
    (ignoreCategoryDetail: IgnoreCategory) =>
      ComparisonService.insertIgnoreCategory({
        appId: props.appId!,
        operationId: props.operationId,
        ignoreCategoryDetail,
      }),
    {
      manual: true,
      ready: !!props.appId,
      onSuccess(success) {
        if (success) {
          message.success(t('message.updateSuccess', { ns: 'common' }));
        } else message.error(t('message.updateFailed', { ns: 'common' }));
      },
    },
  );

  const items = useMemo<CollapseProps['items']>(
    () =>
      diffListFiltered.map((data) => ({
        key: data.id,
        label: (
          <Flex>
            <SceneCode code={data.code} />
            <Typography.Text strong>
              <EllipsisTooltip title={data.operationName} />{' '}
            </Typography.Text>

            <div style={{ marginLeft: '8px' }}>
              {data.isEntry ? (
                <Typography.Text strong type='secondary'>
                  {`[${data.categoryName}]`}
                </Typography.Text>
              ) : (
                <HoveredActionButton
                  hoveredNode={
                    <Button
                      type='text'
                      size='small'
                      onClick={(e) => {
                        e.stopPropagation();
                        insertIgnoreCategory({
                          operationType: data.operationType,
                          operationName: data.operationName,
                        });
                      }}
                    >
                      {t('replayCase.ignore')}
                    </Button>
                  }
                >
                  <Typography.Text strong type='secondary'>
                    {`[${data.categoryName}]`}
                  </Typography.Text>
                </HoveredActionButton>
              )}
            </div>
          </Flex>
        ),
        extra: itemsExtraRender?.(data),
        children: <CaseDiffViewer {...restProps} defaultActiveFirst data={data} height='400px' />,
      })),
    [diffListFiltered, insertIgnoreCategory, itemsExtraRender, restProps],
  );

  return (
    <>
      <CaseDiffTooltip
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
          items={items}
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

export default CaseDiff;
