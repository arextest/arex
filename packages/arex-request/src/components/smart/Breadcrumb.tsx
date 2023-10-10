import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { css, Label, TagsGroup } from '@arextest/arex-core';
import { Breadcrumb, Button, Input, Space, Typography } from 'antd';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

const HoverEditorIconCSS = css`
  display: flex;
  align-items: center;
  transition: opacity 0.3s ease;
  &:hover {
    .editor-icon {
      opacity: 100% !important;
    }
  }
`;

const SmartBreadcrumb: FC<SmartBreadcrumbProps> = (props) => {
  const { t } = useTranslation();
  const { breadcrumb, titleProps, descriptionProps, tagsProps } = useArexRequestProps();
  const [mode, setMode] = useState(Mode.normal);

  const [editValue, setEditValue] = useState<string>();

  const [titleValue, setTitleValue] = useState<string>();
  const [descriptionValue, setDescriptionValue] = useState<string>();
  const [tagsValue, setTagsValue] = useState<string[]>();

  useEffect(() => {
    setTitleValue(titleProps?.value);
  }, [titleProps?.value]);

  useEffect(() => {
    setDescriptionValue(descriptionProps?.value);
  }, [descriptionProps?.value]);

  useEffect(() => {
    setTagsValue(tagsProps?.value);
  }, [tagsProps?.value]);

  const breadcrumbItems = useMemo(
    () =>
      breadcrumb
        ?.map((title) => ({ title }))
        .concat({ title: titleValue || t('request.name') || 'Untitled' }),
    [breadcrumb, titleValue],
  );

  const handleEditSave = () => {
    if (mode === Mode.title) {
      setTitleValue(editValue);
      titleProps?.onChange?.(editValue);
    } else if (mode === Mode.description) {
      setDescriptionValue(editValue);
      descriptionProps?.onChange?.(editValue);
    }

    setMode(Mode.normal);
  };

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        margin-left: 4px;
        width: 100%;
      `}
    >
      {mode === Mode.normal ? (
        <Space>
          <div css={HoverEditorIconCSS}>
            <Breadcrumb items={breadcrumbItems} />

            <Button
              type='link'
              size='small'
              className={'editor-icon'}
              icon={<EditOutlined />}
              onClick={() => {
                setEditValue(titleValue);
                setMode(Mode.title);
              }}
              style={{ opacity: 0 }}
            />
          </div>

          <div style={{ display: 'flex' }}>
            <div css={HoverEditorIconCSS}>
              <Text
                type='secondary'
                css={css`
                  font-size: 12px;
                `}
              >
                {descriptionValue || t('request.description')}
              </Text>

              <Button
                type='link'
                size='small'
                className={'editor-icon'}
                icon={<EditOutlined />}
                onClick={() => {
                  setEditValue(descriptionProps?.value);
                  setMode(Mode.description);
                }}
                style={{ opacity: 0 }}
              />
            </div>

            <TagsGroup
              value={tagsValue}
              options={tagsProps?.options}
              onChange={(value?: string[]) => {
                setTagsValue(value);
                tagsProps?.onChange?.(value);
              }}
            />
          </div>
        </Space>
      ) : (
        [Mode.title, Mode.description].includes(mode) && (
          <Space size='middle' style={{ width: '100%' }}>
            <Label type='secondary' offset={-8}>
              {t(mode === Mode.title ? 'request.name' : 'request.description')}
            </Label>
            <Input
              size='small'
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyUp={(e) => e.code === 'Enter' && handleEditSave()}
              style={{ width: '80%', minWidth: '200px', maxWidth: '320px' }}
            />

            <Button
              size='small'
              icon={<CloseOutlined />}
              onClick={() => {
                setMode(Mode.normal);
                setEditValue(undefined);
              }}
            />
            <Button
              ghost
              type='primary'
              size='small'
              icon={<CheckOutlined />}
              onClick={handleEditSave}
            />
          </Space>
        )
      )}
    </div>
  );
};

export default SmartBreadcrumb;
