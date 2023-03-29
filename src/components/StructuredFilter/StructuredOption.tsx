import styled from '@emotion/styled';
import { Carousel, Menu } from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useImmer } from 'use-immer';

import type { OperatorType } from './keyword';

export type StructuredOptionType = {
  category: string;
  operator: OperatorType[];
  value: string[] | number[] | ItemType[];
};

export type StructuredValue = {
  category?: string;
  operator?: string;
  value?: string | number;
};

export type StructuredOptionProps = {
  size?: SizeType;
  keyword?: string;
  keywordPlaceholder?: ReactNode;
  options: StructuredOptionType[];
  onChange?: (
    mode: StructuredOptionMode,
    value: StructuredValue,
    oldValue?: StructuredValue,
  ) => void;
  onSearch?: (keyword?: string) => void;
};

export type StructuredOptionRef = {
  set: (value: { data?: StructuredValue; type?: (typeof Step)[1] | (typeof Step)[2] }) => void;
  reset: () => void;
};

export enum StructuredOptionMode {
  'append',
  'modify',
}

const Step = ['category', 'operator', 'value'] as const;
const KeywordKey = '__keyword';
const InitialValue = {
  category: undefined,
  operator: undefined,
  value: undefined,
};

const MenuList = styled(Menu)<{ size?: SizeType }>`
  .ant-menu-item {
    height: ${(props) => (props.size === 'small' ? '24px' : '28px')};
    line-height: ${(props) => (props.size === 'small' ? '24px' : '28px')};
  }
`;

const StructuredOption: ForwardRefRenderFunction<StructuredOptionRef, StructuredOptionProps> = (
  props,
  ref,
) => {
  const { keywordPlaceholder = 'Search for this keyword' } = props;
  const carouselRef = useRef<CarouselRef>(null);

  const [mode, setMode] = useState<StructuredOptionMode>(StructuredOptionMode.append); // process: 三步流程模式，single: 单一属性编辑模式
  const [value, setValue] = useImmer<StructuredValue>(InitialValue);

  const categoryOptions = useMemo<ItemType[]>(() => {
    const filterOptions = props.options.filter((o) => o.category.includes(props.keyword || ''));

    return filterOptions.length
      ? filterOptions.map((o) => ({
          label: o.category,
          key: o.category,
        }))
      : [{ label: keywordPlaceholder, key: KeywordKey }];
  }, [props.options, props.keyword, keywordPlaceholder]);

  const operatorOptions = useMemo<ItemType[]>(
    () =>
      props.options
        .find((o) => o.category === value.category)
        ?.operator.map((operator) => ({
          label: operator,
          key: operator,
        })) || [],
    [value.category],
  );

  const valueOptions = useMemo<ItemType[]>(() => {
    const option = props.options.find((o) => o.category === value.category)?.value;

    if (option?.length && ['number', 'string'].includes(typeof option[0]))
      return option.map<ItemType>((value) => ({
        label: value,
        key: value,
      }));
    else return (option as ItemType[]) || [];
  }, [value]);

  useImperativeHandle(ref, () => ({
    set({ type, data }) {
      setMode(StructuredOptionMode.modify);
      setValue(data || InitialValue);
      const step = Step.findIndex((s) => s === type);
      carouselRef.current?.goTo(step >= 0 ? step : 0);
    },
    reset() {
      setValue(InitialValue);
      carouselRef.current?.goTo(0);
    },
  }));

  const handleChange = (data: StructuredValue, step: (typeof Step)[number]) => {
    if (mode === StructuredOptionMode.modify) {
      props.onChange?.(mode, data, value);
      carouselRef.current?.goTo(0, false);
      setMode(StructuredOptionMode.append);
    } else if (mode === StructuredOptionMode.append) {
      if (step === Step[2]) {
        // end of append
        props.onChange?.(mode, data);
        carouselRef.current?.goTo(0, false);
      } else {
        carouselRef.current?.next();
      }
    }
    setValue(data);
  };

  return (
    <div
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Carousel fade ref={carouselRef} dots={false}>
        <MenuList
          size={props.size}
          selectedKeys={[]}
          items={categoryOptions}
          onClick={({ key: category }) => {
            if (category === KeywordKey) return props.onSearch?.(props.keyword);
            handleChange({ ...value, category }, Step[0]);
          }}
        />
        <MenuList
          size={props.size}
          selectedKeys={[]}
          items={operatorOptions}
          onClick={({ key: operator }) => {
            handleChange({ ...value, operator }, Step[1]);
          }}
        />
        <MenuList
          size={props.size}
          selectedKeys={[]}
          items={valueOptions}
          onClick={({ key }) => {
            handleChange({ ...value, value: key }, Step[2]);
          }}
        />
      </Carousel>
    </div>
  );
};

export default forwardRef(StructuredOption);
