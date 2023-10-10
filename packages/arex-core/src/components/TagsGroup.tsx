import { PlusOutlined } from '@ant-design/icons';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Select, SelectProps, Tag, theme } from 'antd';
import { RefSelectProps } from 'antd/es/select';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type TagsValue = {
  label: string;
  value: string;
  color: string;
};

export type TagsGroupProps = {
  value?: string[];
  onChange?: (value?: string[]) => void;
  options?: SelectProps['options'];
};

const TagsGroup: FC<TagsGroupProps> = (props) => {
  const { token } = theme.useToken();
  const { t } = useTranslation();
  const [parent] = useAutoAnimate();

  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState<string[]>();
  const selectRef = useRef<RefSelectProps>(null);

  useEffect(() => {
    if (inputVisible) {
      selectRef.current?.focus();
    }
  }, [inputVisible]);

  const handleClose = (removedTag?: string | null) => {
    const newTags = props.value?.filter((tag) => tag !== removedTag);
    props.onChange?.(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputConfirm = () => {
    inputValue && props.onChange?.([...new Set(inputValue?.concat(props.value || []))]);
    setInputVisible(false);
    setInputValue(undefined);
  };

  const tagChild = useMemo(
    () =>
      props.value?.map((tagKey) => {
        const tag = props.options?.find((tag) => tag.value === tagKey);
        return (
          tag && (
            <span key={tagKey}>
              <Tag
                closable
                color={tag.color}
                onClose={(e) => {
                  e.preventDefault();
                  handleClose(tag.value?.toString());
                }}
              >
                {tag.label}
              </Tag>
            </span>
          )
        );
      }),
    [props.value],
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <div ref={parent}>{tagChild}</div>
      {inputVisible ? (
        <Select
          showSearch
          mode='multiple'
          size='small'
          ref={selectRef}
          style={{ width: 78 }}
          value={inputValue}
          options={props.options}
          onChange={setInputValue}
          onBlur={handleInputConfirm}
        />
      ) : (
        <Tag
          onClick={showInput}
          style={{
            height: '20px',
            cursor: 'pointer',
            background: token.colorBgContainer,
            borderStyle: 'dashed',
          }}
        >
          <PlusOutlined /> {t('newTag')}
        </Tag>
      )}
    </div>
  );
};

export default TagsGroup;
