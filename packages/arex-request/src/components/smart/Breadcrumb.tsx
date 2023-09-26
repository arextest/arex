import { EditOutlined } from '@ant-design/icons';
import { css, TagsGroup } from '@arextest/arex-core';
import { Breadcrumb, Input, Space, Typography } from 'antd';
import React, { FC, useEffect, useState } from 'react';

import { useArexRequestProps } from '../../hooks';

const { Text } = Typography;

export type TitleProps = {
  titleItems?: { title: string }[];
  onChange?: (title?: string) => void;
};

export type TagsProps = {
  value?: string[];
  options?: { color: string; label: string; value: string }[];
  onChange?: (tags?: string[]) => void;
};

export type DescriptionProps = {
  value?: string;
  onChange?: (description?: string) => void;
};

export interface SmartBreadcrumbProps {
  titleProps?: TitleProps;
  tagsProps?: TagsProps;
  descriptionProps?: DescriptionProps;
}

const SmartBreadcrumb: FC<SmartBreadcrumbProps> = (props) => {
  const { titleProps, descriptionProps, tagsProps } = useArexRequestProps();
  const [mode, setMode] = useState('normal');
  const [title, setTitle] = useState('');
  const [tagsValue, setTagsValue] = useState<string[]>();
  const [descriptionValue, setDescriptionValue] = useState('');

  useEffect(() => {
    titleProps?.titleItems && setTitle(titleProps?.titleItems.at(-1)?.title || '');
    setDescriptionValue(descriptionValue);
    setTagsValue(tagsProps?.value);
  }, [descriptionValue, tagsProps?.value, titleProps?.titleItems]);

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
            <Breadcrumb items={titleProps?.titleItems} />
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
                {descriptionValue || descriptionProps?.value || 'description'}
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

            <TagsGroup
              value={tagsValue}
              options={tagsProps?.options}
              onChange={(value) => {
                setTagsValue(value);
                tagsProps?.onChange?.(value);
              }}
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
                titleProps?.onChange?.(title);
              }}
              onKeyUp={(e) => {
                if (e.keyCode === 13) {
                  setMode('normal');
                  titleProps?.onChange?.(title);
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
                descriptionProps?.onChange?.(descriptionValue);
              }}
              onKeyUp={(e) => {
                if (e.code === 'Enter') {
                  setMode('normal');
                  descriptionProps?.onChange?.(descriptionValue);
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
