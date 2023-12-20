import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Button, Divider, Select, SelectProps, Tag, theme } from 'antd';
import { RefSelectProps } from 'antd/es/select';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type LabelsGroupProps = {
  value?: string[];
  onChange?: (value?: string[]) => void;
  onEditLabels?: React.MouseEventHandler<HTMLElement>;
  options?: SelectProps['options'];
};

const LabelsGroup: FC<LabelsGroupProps> = (props) => {
  const { token } = theme.useToken();
  const { t } = useTranslation();
  const [parent] = useAutoAnimate();

  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState<string[]>();

  const [open, setOpen] = useState(false);
  const selectRef = useRef<RefSelectProps>(null);
  useEffect(() => {
    if (inputVisible) {
      selectRef.current?.focus();
      setOpen(true);
    }
  }, [inputVisible]);

  const handleClose = (removedTag?: string | null) => {
    const newTags = props.value?.filter((tag) => tag !== removedTag);
    props.onChange?.(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputConfirm: React.FocusEventHandler<HTMLElement> = (e) => {
    if (e.relatedTarget?.id === 'edit-labels-button') return;
    inputValue && props.onChange?.([...new Set(inputValue?.concat(props.value || []))]);
    setOpen(false);
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
          open={open}
          ref={selectRef}
          style={{ width: 78 }}
          value={inputValue}
          options={props.options}
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: '4px 0' }} />
              <Button
                block
                size='small'
                type='text'
                id='edit-labels-button'
                icon={<EditOutlined />}
                onClick={(e) => {
                  setOpen(false);
                  props.onEditLabels?.(e);
                }}
              >
                {t('edit')}
              </Button>
            </>
          )}
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

export default LabelsGroup;
