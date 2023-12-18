import { PlusOutlined } from '@ant-design/icons';
import { css, FlexCenterWrapper, useTranslation } from '@arextest/arex-core';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Button, Cascader, Empty, Space, Tag } from 'antd';
import { CascaderRef } from 'antd/es/cascader';
import React, { FC, useMemo, useRef, useState } from 'react';

import { CaseTags } from '@/services/ScheduleService';

export interface TagSelectProps {
  tags?: Record<string, string[]>;
  value?: CaseTags;
  onChange?: (value: CaseTags) => void;
}

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}
const TagSelect: FC<TagSelectProps> = (props) => {
  const { tags, value, onChange } = props;
  const { t } = useTranslation('common');

  const [wrapperRef] = useAutoAnimate();
  const cascadeRef = useRef<CascaderRef>(null);

  const [addTagModalVisible, setAddTagModalVisible] = useState(false);

  const options = useMemo<Option[]>(
    () =>
      Object.entries(tags || {}).map(([key, value]) => ({
        label: key,
        value: key,
        children: value.map((v) => ({ label: v, value: v })),
      })),
    [tags],
  );

  return (
    <Space ref={wrapperRef}>
      {Object.entries(value || {}).map(([tagKey, tagValue], index) => (
        <Tag
          closable
          key={`${tagKey}-${tagValue}`}
          onClose={() => {
            const newValue = { ...value };
            delete newValue[tagKey];
            onChange?.(newValue);
          }}
        >{`${tagKey}:${tagValue}`}</Tag>
      ))}

      {addTagModalVisible ? (
        <div
          key='add-tag-input'
          css={css`
            ul.ant-cascader-menu {
              height: auto !important;
            }
          `}
        >
          <Cascader
            ref={cascadeRef}
            allowClear
            value={[]}
            size='small'
            options={options}
            style={{ width: '64px' }}
            open={addTagModalVisible}
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
            notFoundContent={
              <FlexCenterWrapper>
                {Empty.PRESENTED_IMAGE_SIMPLE}
                <span>{t('replay.noCaseTagsFound', { ns: 'components' })}</span>
              </FlexCenterWrapper>
            }
            onBlur={() => {
              setAddTagModalVisible(false);
            }}
            onChange={(value) => {
              setAddTagModalVisible(false);
              onChange?.({ ...props.value, [value[0]]: value[1] as string });
            }}
          />
        </div>
      ) : (
        <Button
          type='dashed'
          size='small'
          key='add-tag-input'
          icon={<PlusOutlined />}
          style={{ width: '64px', fontSize: '10px' }}
          onClick={() => {
            setAddTagModalVisible(true);
            setTimeout(() => cascadeRef.current?.focus());
          }}
        >
          {t('add')}
        </Button>
      )}
    </Space>
  );
};

export default TagSelect;
