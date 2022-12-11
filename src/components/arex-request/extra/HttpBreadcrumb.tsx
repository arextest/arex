import { PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Breadcrumb, Input, InputRef, message, Tag, Tooltip } from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';

import { FileSystemService } from '../../../services/FileSystem.service';

const HttpBreadcrumb: FC<{
  nodePaths: { title: string }[];
  id: string;
  defaultTags: string[];
  nodeType: number;
}> = ({ nodePaths, id, defaultTags, nodeType }) => {
  const tagColors = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
  ];
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [inputValue]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setInputValue('');
  };

  useEffect(() => {
    if (JSON.stringify(tags) !== JSON.stringify(defaultTags) && defaultTags) {
      FileSystemService.saveCase({ id: id, labelIds: tags }).then((res) => {
        message.success(JSON.stringify(res));
      });
    }
  }, [tags]);

  useEffect(() => {
    if (defaultTags) {
      setTags(defaultTags);
    }
  }, [defaultTags]);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        flex: 1;
      `}
    >
      <Breadcrumb>
        {nodePaths.map((nodePath, index) => (
          <Breadcrumb.Item key={index}>{nodePath.title}</Breadcrumb.Item>
        ))}
      </Breadcrumb>

      <div
        css={css`
          display: ${nodeType === 2 ? 'flex' : 'none'};
          flex-direction: row;
          height: 22px;
          margin-left: 24px;
        `}
      >
        {tags.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Input
                ref={editInputRef}
                key={tag}
                size='small'
                className='tag-input'
                value={editInputValue}
                onChange={handleEditInputChange}
                onBlur={handleEditInputConfirm}
                onPressEnter={handleEditInputConfirm}
              />
            );
          }

          const isLongTag = tag.length > 20;

          const tagElem = (
            <Tag
              className='edit-tag'
              color={tagColors[index] || '#000'}
              key={tag}
              closable={true}
              onClose={() => handleClose(tag)}
            >
              <span
                onDoubleClick={(e) => {
                  if (index !== 0) {
                    setEditInputIndex(index);
                    setEditInputValue(tag);
                    e.preventDefault();
                  }
                }}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </span>
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={inputRef}
            type='text'
            size='small'
            className='tag-input'
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag className='site-tag-plus' onClick={showInput}>
            <PlusOutlined /> New Tag
          </Tag>
        )}
      </div>
    </div>
  );
};

export default HttpBreadcrumb;
