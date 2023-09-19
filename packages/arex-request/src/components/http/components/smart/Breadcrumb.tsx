import { EditOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Breadcrumb, Input, Select, Space, Typography } from 'antd';
import { FC, useEffect, useState } from 'react';
const { Text, Link } = Typography;
// 纸笔记录
interface SmartBreadcrumbProps {
  titleItems: { title: string }[];
  description: string;
  tags: string[];
  tagOptions: { color: string; label: string; value: string }[];
  onChange: ({
    title,
    description,
    tags,
  }: {
    title?: string;
    description?: string;
    tags?: string[];
  }) => void;
}
const SmartBreadcrumb: FC<SmartBreadcrumbProps> = ({
  titleItems,
  tags,
  tagOptions,
  description,
  onChange,
}) => {
  const [mode, setMode] = useState('normal');
  const [value, setValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');

  useEffect(() => {
    setValue(titleItems.at(-1)?.title || '');
    setDescriptionValue(description);
  }, []);
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        width: 100%;
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
                margin-left: 10px;
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
                margin-left: 10px;
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
            css={css`
              min-width: 120px;
            `}
            placeholder={'labels'}
            mode={'multiple'}
            defaultValue={tags}
            options={tagOptions}
            bordered={false}
            onChange={(val) => {
              onChange({
                tags: val,
              });
            }}
          />
        </Space>
      ) : (
        <>
          <Input
            css={css`
              display: ${mode === 'title' ? 'inline-block' : 'none'};
            `}
            value={value}
            onChange={(val) => {
              setValue(val.target.value);
            }}
            onBlur={() => {
              setMode('normal');
              onChange({ title: value });
            }}
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                setMode('normal');
                onChange({ title: value });
              }
            }}
          />

          <Input
            css={css`
              display: ${mode === 'description' ? 'inline-block' : 'none'};
            `}
            defaultValue={descriptionValue}
            onChange={(val) => {
              setDescriptionValue(val.target.value);
            }}
            onBlur={(val) => {
              setMode('normal');
              onChange({ description: descriptionValue });
            }}
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                setMode('normal');
                onChange({ description: descriptionValue });
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default SmartBreadcrumb;
