import { EditOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Button } from 'antd';
import React, { FC, useState } from 'react';

const QuickEdit: FC<{ display: any; edit: any }> = ({ display, edit }) => {
  const [mode, setMode] = useState('display');
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        margin-left: 10px;
        &:hover {
          .edit-btn {
            display: inline-block;
          }
        }
      `}
    >
      {mode === 'display' ? display : null}
      {mode === 'edit' ? edit(() => setMode('display')) : null}
      {mode === 'display' ? (
        <Button
          className={'edit-btn'}
          css={css`
            display: none;
          `}
          size='small'
          type='link'
          icon={<EditOutlined />}
          onClick={() => {
            setMode('edit');
          }}
        />
      ) : null}
    </div>
  );
};

export default QuickEdit;
