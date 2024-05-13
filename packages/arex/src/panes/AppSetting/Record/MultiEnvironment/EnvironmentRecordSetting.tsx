import { Label, SmallTextButton, useTranslation } from '@arextest/arex-core';
import { Button, Collapse, Form, InputNumber, TimePicker } from 'antd';
import dayjs from 'dayjs';
import React, { FC, useState } from 'react';

import { TagSelect } from '@/components';
import { DurationInput, IntegerStepSlider } from '@/panes/AppSetting/Record/Standard/FormItem';
import { decodeWeekCode, encodeWeekCode } from '@/panes/AppSetting/Record/Standard/utils';
import { MultiEnvironmentConfig } from '@/services/ConfigService';
import { WithId } from '@/utils';

interface EnvironmentRecordSettingProps {
  tagOptions?: Record<string, string[]>;
  config: MultiEnvironmentConfig & WithId;
  onChange: (_: MultiEnvironmentConfig & WithId) => void;
  onDelete: () => void;
}
const format = 'HH:mm';

const EnvironmentRecordSetting: FC<EnvironmentRecordSettingProps> = (props) => {
  const { tagOptions = {}, config, onChange, onDelete } = props;
  const { t } = useTranslation(['components', 'common']);

  const [activeKey, setActiveKey] = useState<string | string[]>();
  // console.log(config);
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
            extra: (
              <Button type='text' size='small' onClick={() => onDelete()} danger>
                {t('delete', { ns: 'common' })}
              </Button>
            ),
            label: (
              <>
                <Label>{t('appSetting.environment')}</Label>
                <TagSelect
                  multiple
                  value={flattenTags(config.envTags ?? {})}
                  tags={tagOptions}
                  onChange={(value) => {
                    setActiveKey(Object.keys(value || {}).length ? 'environment' : undefined);
                    onChange({ ...config, envTags: extractTags(value ?? {}) });
                  }}
                />
              </>
            ),
            children: (
              <>
                <Form
                  style={{ padding: '8px 16px' }}
                  onValuesChange={(_, all) => {
                    // console.log(all);
                    onChange({
                      ...config,
                      recordMachineCountLimit: all.recordMachineCountLimit,
                      sampleRate: all.sampleRate,
                      allowDayOfWeeks: encodeWeekCode(all.allowDayOfWeeks ?? []),
                      allowTimeOfDayFrom: all.period?.[0]?.format(format),
                      allowTimeOfDayTo: all.period?.[1]?.format(format),
                    });
                  }}
                  initialValues={{
                    recordMachineCountLimit: config.recordMachineCountLimit,
                    allowDayOfWeeks: decodeWeekCode(config.allowDayOfWeeks),
                    period: [
                      dayjs(config.allowTimeOfDayFrom || '00:00', format),
                      dayjs(config.allowTimeOfDayTo || '23:59', format),
                    ],
                    sampleRate: config.sampleRate,
                  }}
                >
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
                    <TimePicker.RangePicker format={format} />
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

// TODO support multi tags for one key here
function flattenTags(source: Record<string, string[]>): Record<string, string> {
  const res: Record<string, string> = {};
  Object.keys(source).forEach((key) => {
    res[key] = source[key][0];
  });
  return res;
}

function extractTags(source: Record<string, string>): Record<string, string[]> {
  const res: Record<string, string[]> = {};
  Object.keys(source).forEach((key) => {
    res[key] = [source[key]];
  });
  return res;
}

export default EnvironmentRecordSetting;
