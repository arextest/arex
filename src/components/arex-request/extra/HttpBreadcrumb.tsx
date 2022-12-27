import { EditOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Breadcrumb, message, Select, Tag, Typography } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const { Text } = Typography;

import request from '../../../helpers/api/axios';
import { FileSystemService } from '../../../services/FileSystem.service';

const HttpBreadcrumb: FC<{
  nodePaths: { title: string }[];
  id: string;
  defaultTags: string[];
  nodeType: number;
}> = ({ nodePaths, id, defaultTags, nodeType }) => {
  const [editEditAble, setEditAble] = useState(false);

  const [labelValue, setLabelValue] = useState<string[]>([]);

  const params = useParams();

  const { data } = useRequest<{ id: string; labelName: string; color: string }[], any[]>(() =>
    request
      .post('/api/label/queryLabelsByWorkspaceId', {
        workspaceId: params.workspaceId,
      })
      .then((r) => r.body.labels),
  );

  useEffect(() => {
    if (defaultTags) {
      setLabelValue(defaultTags.filter((t) => data?.map((d) => d.id).includes(t)));
    }
  }, [defaultTags]);

  return (
    <div
      css={css`
        display: flex;
        flex: 1;
        align-items: center;
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
        <div
          onClick={() => {
            setEditAble(true);
          }}
        >
          {!editEditAble ? (
            <div>
              {labelValue.map((l) => {
                return (
                  <Tag key={l} color={data?.find((d) => d.id === l)?.color}>
                    {data?.find((d) => d.id === l)?.labelName}
                  </Tag>
                );
              })}
              <Text
                type={'secondary'}
                css={css`
                  font-size: 12px;
                  cursor: pointer;
                  margin-right: 8px;
                `}
              >
                Edit Label
                <EditOutlined />
              </Text>
            </div>
          ) : (
            <div>
              <Select
                size={'small'}
                mode='multiple'
                autoFocus
                allowClear
                style={{ minWidth: '240px' }}
                placeholder='Please select'
                value={labelValue}
                onChange={(value) => {
                  setLabelValue(value);
                }}
                onBlur={() => {
                  setEditAble(false);
                  FileSystemService.saveCase({ id: id, labelIds: labelValue }).then(() => {
                    message.success('update label success.');
                  });
                }}
                options={data?.map((t) => ({ label: t.labelName, value: t.id }))}
                tagRender={({ label, value }) => {
                  return (
                    <Tag key={value} color={data?.find((d) => d.id === value)?.color}>
                      {label}
                    </Tag>
                  );
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HttpBreadcrumb;
