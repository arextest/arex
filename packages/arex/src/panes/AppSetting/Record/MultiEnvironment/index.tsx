import { PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { FlexCenterWrapper, Label, useTranslation } from '@arextest/arex-core';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useRequest } from 'ahooks';
import { Button, Card, Collapse, Form, InputNumber, TimePicker, Typography } from 'antd';
import React, { FC, useState } from 'react';

import { TagSelect } from '@/components';
import EnvironmentRecordSetting from '@/panes/AppSetting/Record/MultiEnvironment/EnvironmentRecordSetting';
import { DurationInput, IntegerStepSlider } from '@/panes/AppSetting/Record/Standard/FormItem';
import { ApplicationService } from '@/services';
import { CaseTags } from '@/services/ScheduleService';

interface MultiEnvironmentProps {
  appId: string;
}

const MultiEnvironment: FC<MultiEnvironmentProps> = (props) => {
  const [settingWrapper] = useAutoAnimate();

  const { data: appInfo, refresh: getAppInfo } = useRequest(ApplicationService.getAppInfo, {
    defaultParams: [props.appId],
  });

  const [data, setData] = useState<any[]>([]);
  return (
    <>
      <div ref={settingWrapper}>
        {data.map((item, index) => (
          <EnvironmentRecordSetting key={index} tags={appInfo?.tags} />
        ))}
      </div>
      <Button
        block
        type='dashed'
        icon={<PlusOutlined />}
        onClick={() => {
          setData([...data, {}]);
        }}
        style={{ height: 'auto', padding: '16px', marginTop: '8px' }}
      >
        <span style={{ padding: '0 8px' }}>添加环境配置</span>
      </Button>
    </>
  );
};

export default MultiEnvironment;
