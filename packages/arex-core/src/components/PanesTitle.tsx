import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Input, Space, theme, Typography } from 'antd';
import React, { ReactNode, useState } from 'react';

import { SmallTextButton } from './index';

export type PanesTitleProps = Omit<HTMLDivElement, 'title'> & {
  title: ReactNode;
  extra?: ReactNode;
  editable?: boolean; // when title types is string take effect
  onSave?: (title: string) => void;
};

const PanesTitle = styled((props: PanesTitleProps) => {
  const { title, extra, editable, onSave, style, ...extraProps } = props;
  const { token } = theme.useToken();

  const [editableTitle, setEditableTitle] = useState<string>(
    typeof title === 'string' ? (props.title as string) : '',
  );
  const [edit, setEdit] = useState(false);

  const handleSaveEdit = () => {
    setEdit(false);
    onSave?.(editableTitle);
  };

  const handleCancelEdit = () => {
    setEdit(false);
    setEditableTitle(title as string);
  };

  return (
    // @ts-ignore
    <div style={{ marginBottom: `${token.marginXS}px`, ...style }} {...extraProps}>
      <Space className='title'>
        {edit ? (
          <Input
            size='small'
            value={editableTitle}
            onChange={(e) => setEditableTitle(e.target.value)}
          />
        ) : (
          <Typography.Title ellipsis level={3} style={{ marginBottom: 0 }}>
            {title}
          </Typography.Title>
        )}
        {editable &&
          (edit ? (
            <Space>
              <SmallTextButton
                color={'primary'}
                icon={<CloseOutlined />}
                onClick={handleCancelEdit}
              />
              <SmallTextButton
                color={'primary'}
                icon={<CheckOutlined />}
                onClick={handleSaveEdit}
              />
            </Space>
          ) : (
            <SmallTextButton
              color={'primary'}
              icon={<EditOutlined />}
              onClick={() => setEdit(true)}
              style={{ marginLeft: '4px' }}
            />
          ))}
      </Space>
      {extra && <span>{extra}</span>}
    </div>
  );
})<PanesTitleProps>`
  height: 32px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .title {
    margin: 0 auto 0 0;
  }
  & > span > *:not(h2) {
    margin-left: 16px;
  }
`;

export default PanesTitle;
