import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useRequest } from 'ahooks';
import { Breadcrumb, Button, Space, Spin, Typography } from 'antd';
import React, { FC, useMemo } from 'react';

import { PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { ReportService } from '@/services';
import { PlanItemStatistic } from '@/services/ReportService';
import { useMenusPanes } from '@/store';

export type PlanItemNavigationProps = {
  type: PanesType;
  planItemId: string;
  onGetPlanItemData?: (planItem: PlanItemStatistic) => void;
};

const PlanItemNavigation: FC<PlanItemNavigationProps> = (props) => {
  const { removePane } = useMenusPanes();
  const navPane = useNavPane();
  const [titleRef] = useAutoAnimate();

  // fetch initial data
  const { data: planItemData } = useRequest(ReportService.queryPlanItemStatistic, {
    ready: !!props.planItemId,
    defaultParams: [props.planItemId],
    onSuccess: props.onGetPlanItemData,
  });

  // TODO: fetch when first click
  const { data: planData = [] } = useRequest(
    () =>
      ReportService.queryPlanItemStatistics({
        planId: planItemData!.planId,
      }),
    {
      ready: !!planItemData?.planId,
      onSuccess(res) {
        // console.log(res?.map((item) => item.planItemId));
      },
    },
  );

  const planItemList = useMemo(
    () => planData?.filter((item) => item.failCaseCount).map((item) => item.planItemId) || [],
    [planData],
  );
  const index = useMemo(
    () => planItemList.findIndex((item) => item === props.planItemId),
    [planItemList, props.planItemId],
  );

  const handleClickNav = (target: 'prev' | 'next') => {
    const nextPlanItemId =
      target === 'prev'
        ? planItemList[index - 1] || planItemList[planItemList.length - 1]
        : planItemList[index + 1] || planItemList[0];
    removePane(undefined);
    navPane({
      type: props.type,
      id: nextPlanItemId,
    });
  };

  return (
    <>
      {planItemData ? (
        <Space>
          <Breadcrumb
            separator='>'
            items={[
              {
                key: planItemData.appId,
                title: <a>{planItemData.appName || planItemData.appId}</a>,
                onClick: () =>
                  navPane({
                    type: PanesType.REPLAY,
                    id: planItemData.appId,
                    data: {
                      planId: planItemData.planId,
                      planItemId: planItemData.planItemId,
                    },
                  }),
              },
              {
                key: planItemData.planItemId,
                title: planItemData.operationName || 'unknown',
              },
            ]}
          />

          <span ref={titleRef}>
            {planItemList.length > 1 && (
              <Space>
                <Button
                  size='small'
                  type='text'
                  onClick={() => handleClickNav('prev')}
                  style={{ marginLeft: '8px' }}
                >
                  <Typography.Text type='secondary'>
                    <LeftOutlined /> Prev
                  </Typography.Text>
                </Button>

                <Typography.Text type='secondary'>
                  {index + 1} / {planItemList.length}
                </Typography.Text>

                <Button size='small' type='text' onClick={() => handleClickNav('next')}>
                  <Typography.Text type='secondary'>
                    Next <RightOutlined />
                  </Typography.Text>
                </Button>
              </Space>
            )}
          </span>
        </Space>
      ) : (
        <>
          <Spin />
        </>
      )}
    </>
  );
};

export default PlanItemNavigation;
