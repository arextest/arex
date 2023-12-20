import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { css, Label, LabelsGroup } from '@arextest/arex-core';
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

export type LabelsProps = {
  value?: string[];
  options?: { color: string; label: string; value: string }[];
  onChange?: (tags?: string[]) => void;
  onEditLabels?: () => void;
};

export type DescriptionProps = {
  value?: string;
  onChange?: (description?: string) => void;
};

export interface InfoSummaryProps {
  breadcrumb?: string[];
  titleProps?: TitleProps;
  labelsProps?: LabelsProps;
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

const InfoSummary: FC<InfoSummaryProps> = (props) => {
  const { t } = useTranslation();
  const { breadcrumb, titleProps, descriptionProps, labelsProps } = useArexRequestProps();
  const [mode, setMode] = useState(Mode.normal);

  const [editValue, setEditValue] = useState<string>();

  const [titleValue, setTitleValue] = useState<string>();
  const [descriptionValue, setDescriptionValue] = useState<string>();
  const [labelsValue, setLabelsValue] = useState<string[]>();

  useEffect(() => {
    setTitleValue(titleProps?.value);
  }, [titleProps?.value]);

  useEffect(() => {
    setDescriptionValue(descriptionProps?.value);
  }, [descriptionProps?.value]);

  useEffect(() => {
    setLabelsValue(labelsProps?.value);
  }, [labelsProps?.value]);

  const breadcrumbItems = useMemo(
    () =>
      breadcrumb
        ?.map((title: string) => ({ title }))
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
        width: 100%;
        display: flex;
        align-items: center;
        margin-left: 4px;
      `}
    >
      {mode === Mode.normal ? (
        <>
          <div css={HoverEditorIconCSS} style={{ maxWidth: '50%' }}>
            <Breadcrumb
              items={breadcrumbItems}
              css={css`
                width: 100%;
                ol {
                  flex-wrap: nowrap;
                  flex-shrink: 1;
                  li {
                    white-space: nowrap;
                    overflow-x: hidden;
                    text-overflow: ellipsis;
                  }
                }
              `}
            />

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

          <div style={{ display: 'flex', flexShrink: 0 }}>
            <div css={HoverEditorIconCSS}>
              <Text
                ellipsis
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

            <div>
              <LabelsGroup
                value={labelsValue}
                options={labelsProps?.options}
                onChange={(value?: string[]) => {
                  setLabelsValue(value);
                  labelsProps?.onChange?.(value);
                }}
                onEditLabels={() => {
                  labelsProps?.onEditLabels?.();
                }}
              />
            </div>
          </div>
        </>
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

export default InfoSummary;
