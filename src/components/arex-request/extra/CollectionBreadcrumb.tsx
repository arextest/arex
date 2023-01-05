import { EditOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { App, Breadcrumb, Button, Select, Space, Tag, Typography } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CollectionService } from '../../../services/Collection.service';
import { FileSystemService } from '../../../services/FileSystem.service';
import { SpaceBetweenWrapper } from '../../styledComponents';

const { Text } = Typography;

export type HttpBreadcrumbProps = {
  nodePath: string[];
  id: string;
  defaultTags?: string[];
  nodeType: number;
};

const CollectionBreadcrumb: FC<HttpBreadcrumbProps> = ({ nodePath, id, defaultTags, nodeType }) => {
  const params = useParams();
  const { message } = App.useApp();

  const [editEditAble, setEditAble] = useState(false);
  const [labelValue, setLabelValue] = useState<string[]>([]);

  const { data: labelsData } = useRequest(
    () => CollectionService.queryLabels({ workspaceId: params.workspaceId as string }),
    {
      ready: !!params.workspaceId,
    },
  );

  useEffect(() => {
    defaultTags &&
      setLabelValue(defaultTags.filter((t) => labelsData?.map((d) => d.id).includes(t)));
  }, [defaultTags, labelsData]);

  const { run: saveLabel } = useRequest(FileSystemService.saveCase, {
    manual: true,
    onSuccess(success) {
      success ? message.success('update label success') : message.error('update label failed');
    },
    onFinally() {
      setEditAble(false);
    },
  });

  return (
    <SpaceBetweenWrapper>
      <Space>
        <Breadcrumb>
          {nodePath.map((title, index) => (
            <Breadcrumb.Item key={index}>{title}</Breadcrumb.Item>
          ))}
        </Breadcrumb>

        {nodeType === 2 &&
          (!editEditAble ? (
            <>
              {labelValue.map((id) => (
                <Tag key={id} color={labelsData?.find((d) => d.id === id)?.color}>
                  {labelsData?.find((d) => d.id === id)?.labelName}
                </Tag>
              ))}

              <Button size='small' type='link' icon={<EditOutlined />}>
                <Text
                  type={'secondary'}
                  onClick={() => {
                    setEditAble(true);
                  }}
                  style={{ fontSize: '12px' }}
                >
                  Edit Label
                </Text>
              </Button>
            </>
          ) : (
            <Select
              autoFocus
              allowClear
              size='small'
              mode='multiple'
              placeholder='Please select'
              value={labelValue}
              options={labelsData?.map((t) => ({ label: t.labelName, value: t.id }))}
              tagRender={({ label, value }) => (
                <Tag key={value} color={labelsData?.find((d) => d.id === value)?.color}>
                  {label}
                </Tag>
              )}
              onBlur={() => saveLabel({ id, labelIds: labelValue })}
              onChange={setLabelValue}
            />
          ))}
      </Space>
    </SpaceBetweenWrapper>
  );
};

export default CollectionBreadcrumb;
