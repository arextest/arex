import { CloseCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useHover } from 'ahooks';
import { Button, Space, Tag, Typography } from 'antd';
import { DefaultOptionType } from 'rc-select/lib/Select';
import React, { useMemo, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import { tryParseJsonString } from '../../helpers/utils';
import { Label } from '../../services/Collection.type';
import { useStore } from '../../store';
import { CategoryKey } from './keyword';
import { StructuredValue } from './StructuredOption';

export type StructuredTagProps = {
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
  const { labelData } = useStore();

  const categoryRef = useRef<HTMLDivElement>(null);
  const closeIconRef = useRef<HTMLDivElement>(null);
  const categoryNodeRef = useRef(null);

  const hoverCategoryButton = useHover(categoryRef);

  const data = useMemo(
    () => tryParseJsonString<StructuredValue>(props.value as string),
    [props.value],
  );

  const label = useMemo<Label | undefined>(() => {
    const isLabel = data?.category === CategoryKey.LabelKey;
    return isLabel ? labelData.find((label) => label.id === data.value) : undefined;
  }, [labelData, props.value]);

  return (
    <StructuredTagWrapper>
      <Space.Compact block size='small' style={{ margin: '4px' }}>
        {React.createElement(
          data?.category === CategoryKey.LabelKey ? Tag : Button,
          {
            color: label?.color,
            ref: categoryRef,
            onClick: () => props.onDelete?.(data),
          },
          <>
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
          </>,
        )}

        <Button size='small' onClick={() => props.onOperatorClick?.(data)}>
          {data?.operator}
        </Button>
        <Button size='small' onClick={() => props.onValueClick?.(data)}>
          {label?.labelName || data?.value}
        </Button>
      </Space.Compact>
    </StructuredTagWrapper>
  );
};

export default StructuredTag;
