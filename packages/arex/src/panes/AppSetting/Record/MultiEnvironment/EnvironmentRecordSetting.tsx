import { Label, useTranslation } from '@arextest/arex-core';
import { Collapse, Form, InputNumber, TimePicker } from 'antd';
import React, { FC, useState } from 'react';

import { TagSelect } from '@/components';
import { DurationInput, IntegerStepSlider } from '@/panes/AppSetting/Record/Standard/FormItem';
import { CaseTags } from '@/services/ScheduleService';

interface EnvironmentRecordSettingProps {
  tags?: Record<string, string[]>;
}
const EnvironmentRecordSetting: FC<EnvironmentRecordSettingProps> = (props) => {
  const { tags = {} } = props;
  const { t } = useTranslation('components');

  const [tagValue, setTagValue] = useState<CaseTags>();
  const [activeKey, setActiveKey] = useState<string | string[]>();
  return (
    <div style={{ marginBottom: '8px' }}>
      <Collapse
        size='small'
        collapsible='icon'
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          {
            key: 'environment',
            label: (
              <>
                <Label>Environment</Label>
                <TagSelect
                  multiple
                  value={tagValue}
                  tags={tags}
                  onChange={(value) => {
                    setActiveKey(Object.keys(value || {}).length ? 'environment' : undefined);
                    setTagValue(value);
                  }}
                />
              </>
            ),
            children: (
              <>
                <Form style={{ padding: '8px 16px' }}>
                  <Form.Item
                    label={t('appSetting.recordMachineNum')}
                    name='recordMachineCountLimit'
                  >
                    <InputNumber size='small' min={0} max={10} precision={0} />
                  </Form.Item>

                  <Form.Item label={t('appSetting.duration')} name='allowDayOfWeeks'>
                    <DurationInput />
                  </Form.Item>

                  <Form.Item label={t('appSetting.period')} name='period'>
                    <TimePicker.RangePicker format={'HH:mm'} />
                  </Form.Item>

                  <Form.Item label={t('appSetting.frequency')} name='sampleRate'>
                    <IntegerStepSlider />
                  </Form.Item>
                </Form>
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default EnvironmentRecordSetting;
