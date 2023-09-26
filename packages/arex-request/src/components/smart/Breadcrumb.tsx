import { EditOutlined } from '@ant-design/icons';
import { css } from '@arextest/arex-core';
import { Breadcrumb, Input, Select, Space, Tag, Typography } from 'antd';
import React, { FC, useEffect, useState } from 'react';

import { useArexRequestProps } from '../../hooks';

const { Text } = Typography;

export interface SmartBreadcrumbProps {
  titleItems?: { title: string }[];
  description?: string;
  tags?: string[];
  tagOptions?: { color: string; label: string; value: string }[];
  onTitleChange?: (title?: string) => void;
  onDescriptionChange?: (description?: string) => void;
  onTagsChange?: (tags?: string[]) => void;
}
const SmartBreadcrumb: FC<SmartBreadcrumbProps> = (props) => {
  const {
    titleItems,
    tags,
    tagOptions,
    description,
    onTitleChange,
    onDescriptionChange,
    onTagsChange,
  } = useArexRequestProps();
  const [mode, setMode] = useState('normal');
  const [title, setTitle] = useState('');
  const [tagsValue, setTagsValue] = useState<string[]>();
  const [descriptionValue, setDescriptionValue] = useState('');

  useEffect(() => {
    titleItems && setTitle(titleItems.at(-1)?.title || '');
    setDescriptionValue(descriptionValue);
    setTagsValue(tags);
  }, [descriptionValue, tags, titleItems]);

  // TODO REFACTOR
  return (
    <div
      css={css`
        margin-top: 4px;
        display: flex;
        align-items: center;
      `}
    >
      {mode === 'normal' ? (
        <Space>
          <div
            css={css`
              display: flex;
              align-items: center;
              &:hover {
                .editor-icon {
                  visibility: unset !important;
                }
              }
            `}
          >
            <Breadcrumb items={titleItems} />
            <div
              className={'editor-icon'}
              css={css`
                visibility: hidden;
                cursor: pointer;
              `}
            >
              <EditOutlined
                onClick={() => {
                  setMode('title');
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex' }}>
            <div
              css={css`
                display: flex;
                align-items: center;
                &:hover {
                  .editor-icon {
                    visibility: unset !important;
                  }
                }
              `}
            >
              <Text
                type='secondary'
                css={css`
                  font-size: 12px;
                `}
              >
                {descriptionValue || description || 'description'}
              </Text>

              <div
                className={'editor-icon'}
                css={css`
                  visibility: hidden;
                  cursor: pointer;
                `}
              >
                <EditOutlined
                  onClick={() => {
                    setMode('description');
                  }}
                />
              </div>
            </div>

            <Select
              placeholder={<Tag>Add labels</Tag>}
              mode={'multiple'}
              value={tagsValue}
              options={tagOptions}
              bordered={false}
              onChange={(value) => {
                setTagsValue(value);
                onTagsChange?.(value);
              }}
              style={{ width: '120px' }}
            />
          </div>
        </Space>
      ) : (
        <>
          {mode === 'title' && (
            <Input
              value={title}
              onChange={(val) => {
                setTitle(val.target.value);
              }}
              onBlur={() => {
                setMode('normal');
                onTitleChange?.(title);
              }}
              onKeyUp={(e) => {
                if (e.keyCode === 13) {
                  setMode('normal');
                  onTitleChange?.(title);
                }
              }}
            />
          )}

          {mode === 'description' && (
            <Input
              defaultValue={descriptionValue}
              onChange={(val) => {
                setDescriptionValue(val.target.value);
              }}
              onBlur={() => {
                setMode('normal');
                onDescriptionChange?.(descriptionValue);
              }}
              onKeyUp={(e) => {
                if (e.code === 'Enter') {
                  setMode('normal');
                  onDescriptionChange?.(descriptionValue);
                }
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SmartBreadcrumb;
