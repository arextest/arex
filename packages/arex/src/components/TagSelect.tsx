import { PlusOutlined } from '@ant-design/icons';
import { css, useTranslation } from '@arextest/arex-core';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Button, Cascader, Empty, Space, Tag } from 'antd';
import { CascaderRef, DefaultOptionType } from 'antd/es/cascader';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';

import SearchHighLight from '@/components/SearchHighLight';
import { CaseTags } from '@/services/ScheduleService';

export interface TagSelectProps {
  multiple?: boolean;
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
  const { multiple, tags, value, onChange } = props;
  const { t } = useTranslation('common');

  const [wrapperRef] = useAutoAnimate();

  const cascaderRef = useRef<CascaderRef>(null);
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

  const filter = (inputValue: string, path: DefaultOptionType[]) =>
    path
      .map((option) => option.label)
      .join(':')
      .toLowerCase()
      .includes(inputValue.toLowerCase());

  useEffect(() => {
    addTagModalVisible && cascaderRef.current?.focus();
  }, [addTagModalVisible]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter') {
      // @ts-ignore
      const [key, value, ...rest] = e.target.value?.split(':') || [];
      if (key && value && !rest.length) {
        onChange?.({ ...props.value, [key]: value });
        setAddTagModalVisible(false);
      }
    }
  };

  const handleChange = (value: (string | number | null)[]) => {
    setAddTagModalVisible(false);
    onChange?.({ ...props.value, [value[0]!.toString()]: value[1] as string });
  };

  const TagNotFound = (
    <div style={{ textAlign: 'center' }}>
      <div>{Empty.PRESENTED_IMAGE_SIMPLE}</div>
      <div style={{ padding: '12px' }}>{t('components:record.noTagFound')}</div>
      <div>{t('components:record.createTagTip')}</div>
    </div>
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

      {!multiple && Object.keys(value || {}).length ? null : addTagModalVisible ? (
        <div
          key='add-tag-input'
          css={css`
            ul.ant-cascader-menu {
              height: auto !important;
            }
          `}
        >
          <Cascader
            ref={cascaderRef}
            allowClear
            value={[]}
            size='small'
            options={options}
            open={addTagModalVisible}
            placeholder={t('components:record.searchOrCreateTag')}
            // getPopupContainer={(triggerNode) => triggerNode.parentElement}
            notFoundContent={TagNotFound}
            showSearch={{
              filter,
              render: (inputValue, options) => (
                <SearchHighLight
                  keyword={inputValue}
                  text={options.map((item) => item.value).join(':')}
                />
              ),
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => setAddTagModalVisible(false)}
            onChange={handleChange}
          />
        </div>
      ) : (
        <Button
          type='dashed'
          size='small'
          key='add-tag-input'
          icon={<PlusOutlined />}
          style={{ width: '64px', fontSize: '10px' }}
          onClick={() => setAddTagModalVisible(true)}
        >
          {t('add')}
        </Button>
      )}
    </Space>
  );
};

export default TagSelect;
