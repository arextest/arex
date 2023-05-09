import { CloseCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useHover } from 'ahooks';
import { Button, Space, Tag, theme, Typography } from 'antd';
import React, { useMemo, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import { tryParseJsonString } from '../../utils';
import { Label } from './index';
import { CategoryKey } from './keyword';
import { StructuredValue } from './StructuredOption';

export interface BaseOptionType {
  disabled?: boolean;
  [name: string]: any;
}
export interface DefaultOptionType extends BaseOptionType {
  label: React.ReactNode;
  value?: string | number | null;
  children?: Omit<DefaultOptionType, 'children'>[];
}

export type StructuredTagProps = {
  labelSource?: Label[];
  onOperatorClick?: (data?: StructuredValue) => void;
  onValueClick?: (data?: StructuredValue) => void;
  onDelete?: (data?: StructuredValue) => void;
} & DefaultOptionType;

const StructuredTagWrapper = styled.div`
  .structure-tag-hidden {
    opacity: 0;
  }
  .my-node-enter {
    opacity: 0;
  }
  .my-node-enter-active {
    opacity: 1;
    transition: opacity 200ms;
  }
  .my-node-exit {
    opacity: 1;
  }
  .my-node-exit-active {
    opacity: 0;
    transition: opacity 200ms;
  }

  .ant-tag {
    position: relative;
    cursor: pointer;
    margin-inline-end: -1px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const StructuredTag = (props: StructuredTagProps) => {
  const { token } = theme.useToken();

  const categoryRef = useRef<HTMLDivElement>(null);
  const closeIconRef = useRef<HTMLDivElement>(null);
  const categoryNodeRef = useRef(null);

  const hoverCategoryButton = useHover(categoryRef);

  const data = useMemo(
    () => tryParseJsonString<StructuredValue>(props.value as string),
    [props.value],
  );

  const label = useMemo<Label | undefined>(() => {
    const isLabel = data?.category === CategoryKey.Label;
    return isLabel && props.labelSource
      ? props.labelSource.find((label) => label.id === data.value)
      : undefined;
  }, [props.labelSource, props.value]);

  return (
    <StructuredTagWrapper>
      <Space.Compact block size='small' style={{ margin: '4px' }}>
        <Button ref={categoryRef} onClick={() => props.onDelete?.(data)}>
          <CSSTransition
            nodeRef={categoryNodeRef}
            in={!hoverCategoryButton}
            timeout={2000}
            classNames='my-node'
          >
            <Typography ref={categoryNodeRef}>{data?.category}</Typography>
          </CSSTransition>
          <CSSTransition
            nodeRef={closeIconRef}
            in={hoverCategoryButton}
            timeout={2000}
            classNames='my-node'
          >
            <CloseCircleOutlined
              ref={closeIconRef}
              className='structure-tag-hidden'
              style={{
                position: 'absolute',
                left: '50%',
                top: ' 50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </CSSTransition>
        </Button>

        <Button size='small' onClick={() => props.onOperatorClick?.(data)}>
          {data?.operator}
        </Button>

        {React.createElement(
          // @ts-ignore
          data?.category === CategoryKey.Label ? Tag : Button,
          {
            color: label?.color,
            className: 'ant-btn-default',
            onClick: () => props.onValueClick?.(data),
            style: { borderRadius: `0 ${token.borderRadiusSM}px ${token.borderRadiusSM}px 0` },
          },
          label?.name || data?.value,
        )}
      </Space.Compact>
    </StructuredTagWrapper>
  );
};

export default StructuredTag;
