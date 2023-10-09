import { EditOutlined } from '@ant-design/icons';
import { css, TagsGroup } from '@arextest/arex-core';
import { Breadcrumb, Input, InputProps, Space, Typography } from 'antd';
import React, { FC, useEffect, useMemo, useState } from 'react';

import { useArexRequestProps } from '../../hooks';

const { Text } = Typography;
enum Mode {
  'normal',
  'title',
  'description',
}

export type TitleProps = {
  value?: string;
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
  breadcrumb?: string[];
  titleProps?: TitleProps;
  tagsProps?: TagsProps;
  descriptionProps?: DescriptionProps;
}

const SmartBreadcrumb: FC<SmartBreadcrumbProps> = (props) => {
  const { breadcrumb, titleProps, descriptionProps, tagsProps } = useArexRequestProps();
  const [mode, setMode] = useState(Mode.normal);

  const [title, setTitle] = useState<string>();
  const [titleStatus, setTitleStatus] = useState<InputProps['status']>();

  const [tagsValue, setTagsValue] = useState<string[]>();
  const [descriptionValue, setDescriptionValue] = useState('');

  useEffect(() => {
    setTitle(titleProps?.value);
    setDescriptionValue(descriptionValue);
    setTagsValue(tagsProps?.value);
  }, [descriptionValue, tagsProps?.value, titleProps?.value]);

  const breadcrumbItems = useMemo(
    () => breadcrumb?.map((title) => ({ title })).concat({ title: title || '' }),
    [breadcrumb, title],
  );

  // TODO REFACTOR
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        width: 100%;
      `}
    >
      {mode === Mode.normal ? (
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
            <Breadcrumb items={breadcrumbItems} />
            <div
              className={'editor-icon'}
              css={css`
                visibility: hidden;
                cursor: pointer;
              `}
            >
              <EditOutlined
                onClick={() => {
                  setMode(Mode.title);
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
                    setMode(Mode.description);
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
          {mode === Mode.title && (
            <Input
              size='small'
              value={title}
              status={titleStatus}
              onChange={(val) => {
                titleStatus === 'error' && title && setTitleStatus(undefined);
                setTitle(val.target.value);
              }}
              onBlur={(e) => {
                const title = e.target.value;
                if (!title) {
                  setTitleStatus('error');
                } else {
                  setMode(Mode.normal);
                  titleProps?.onChange?.(title);
                }
              }}
              onKeyUp={(e) => {
                if (e.keyCode === 13) {
                  if (!title) {
                    setTitleStatus('error');
                  } else {
                    setMode(Mode.normal);
                    titleProps?.onChange?.(title);
                  }
                }
              }}
              style={{ width: '80%', maxWidth: '320px' }}
            />
          )}

          {mode === Mode.description && (
            <Input
              defaultValue={descriptionValue}
              onChange={(val) => {
                setDescriptionValue(val.target.value);
              }}
              onBlur={() => {
                setMode(Mode.normal);
                descriptionProps?.onChange?.(descriptionValue);
              }}
              onKeyUp={(e) => {
                if (e.code === 'Enter') {
                  setMode(Mode.normal);
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
