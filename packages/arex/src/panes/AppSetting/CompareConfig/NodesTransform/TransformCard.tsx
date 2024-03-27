import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { SmallTextButton, TooltipButton, useTranslation } from '@arextest/arex-core';
import {
  Button,
  Card,
  Flex,
  Input,
  InputRef,
  Popconfirm,
  Select,
  SelectProps,
  Space,
  Steps,
  theme,
} from 'antd';
import React, { FC, ReactNode, useEffect, useRef } from 'react';

import { Icon } from '@/components';
import { TransformNode } from '@/services/ComparisonService';

export interface TransformCardProps {
  edit?: boolean;
  data: Partial<TransformNode>;
  options?: SelectProps<string>['options'];
  onNodePathChange?: (path: string[]) => void;
  onPathLocationClick?: () => void;
  onMethodNameChange?: (value: string, methodIndex: number) => void;
  onMethodArgsChange?: (value: string, methodIndex: number) => void;
  onInsertBefore?: (methodIndex: number) => void;
  onInsertAfter?: (methodIndex: number) => void;
  onDrop?: (methodIndex: number) => void;
  onAdd?: () => void;
  onSave?: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  onDelete?: (id: string) => void;
}

const TransformCard: FC<TransformCardProps> = (props) => {
  const { t } = useTranslation('components');
  const { token } = theme.useToken();

  const nodePathRef = useRef<InputRef>(null);
  useEffect(() => {
    props.edit && nodePathRef.current?.focus();
  }, [props.edit]);

  const items: { title: ReactNode; description?: ReactNode }[] = [
    {
      title: t('appSetting.originalNode'),
      description: (
        <Flex align='center' style={{ width: 'auto' }}>
          <Input
            ref={nodePathRef}
            readOnly={!props.edit}
            variant={props.edit ? 'outlined' : 'borderless'}
            value={props.data.transformDetail?.nodePath.join('/')}
            onChange={(e) => props.onNodePathChange?.(e.target.value.split('/'))}
            placeholder={t('appSetting.transformNodePath') as string}
            style={{
              display: 'inline-block',
              textAlign: 'center',
              height: '18px',
              width: 'auto',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: token.colorTextDescription,
            }}
          />
          {props.edit && (
            <SmallTextButton
              icon={<Icon name='Crosshair' />}
              onClick={props.onPathLocationClick}
              style={{ color: token.colorTextDescription, marginLeft: '4px' }}
            />
          )}
        </Flex>
      ),
    },
  ];

  items.push(
    ...props.data.transformDetail!.transformMethods.map((method, methodIndex) => ({
      title: props.edit ? (
        <Select
          size='small'
          variant={props.edit ? 'outlined' : 'borderless'}
          placeholder={t('appSetting.transformMethodName')}
          value={method.methodName}
          options={props.options}
          onChange={(value) => props.onMethodNameChange?.(value, methodIndex)}
          style={{ width: '112px' }}
        />
      ) : (
        <Input
          readOnly
          variant='borderless'
          value={method.methodName}
          style={{ textAlign: 'center', fontWeight: 'bold', padding: 0 }}
        />
      ),
      description: (
        <Input
          size='small'
          readOnly={!props.edit}
          variant={props.edit ? 'outlined' : 'borderless'}
          placeholder={t('appSetting.transformMethodArgs') as string}
          value={method.methodArgs}
          onChange={(e) => props.onMethodArgsChange?.(e.target.value, methodIndex)}
          style={{
            display: 'inline-block',
            textAlign: 'center',
            color: token.colorTextDescription,
            width: '112px',
            height: '18px',
          }}
        />
      ),
    })),
  );

  items.push({ title: t('appSetting.transformedNode') });

  return (
    <Card size='small' style={{ margin: '8px 0' }}>
      <Steps
        // direction={lg ? 'horizontal' : 'vertical'}
        current={items?.length}
        items={items}
        progressDot={(dot, { index: methodIndex }) => (
          <>
            {props.edit && !!methodIndex && methodIndex < (items?.length || 0) - 1 && (
              <Space.Compact style={{ position: 'absolute', left: '-31px', top: '-26px' }}>
                <TooltipButton
                  title='Insert Before'
                  icon={<VerticalAlignBottomOutlined rotate={90} />}
                  onClick={() => props.onInsertBefore?.(methodIndex)}
                />
                <TooltipButton
                  title='Delete'
                  icon={<DeleteOutlined />}
                  onClick={() => props.onDrop?.(methodIndex)}
                />
                <TooltipButton
                  title='Insert After'
                  icon={<VerticalAlignTopOutlined rotate={90} />}
                  onClick={() => props.onInsertAfter?.(methodIndex)}
                />
              </Space.Compact>
            )}

            <div style={{ height: '7px' }}>{dot}</div>
          </>
        )}
        style={{ marginTop: '20px' }}
      />

      <Space.Compact size='small' style={{ position: 'absolute', right: 8, top: 4 }}>
        {props.edit ? (
          <>
            <Button type='text' icon={<CloseOutlined />} onClick={props.onCancel}>
              {t('cancel', { ns: 'common' })}
            </Button>

            <Button type='text' icon={<PlusOutlined />} onClick={props.onAdd}>
              {t('add', { ns: 'common' })}
            </Button>
            <Button type='text' icon={<SaveOutlined />} onClick={props.onSave}>
              {t('save', { ns: 'common' })}
            </Button>
          </>
        ) : (
          <Button type='text' icon={<EditOutlined />} onClick={props.onEdit}>
            {t('edit', { ns: 'common' })}
          </Button>
        )}
      </Space.Compact>

      {props.edit && (
        <Popconfirm
          title={t('appSetting.deleteTransformConfirm')}
          onConfirm={() => props.onDelete?.(props.data.id!)}
        >
          <Button
            danger
            type='text'
            size='small'
            icon={<DeleteOutlined />}
            style={{ position: 'absolute', left: 8, top: 4 }}
          >
            {t('delete', { ns: 'common' })}
          </Button>
        </Popconfirm>
      )}
    </Card>
  );
};

export default TransformCard;
