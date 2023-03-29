import { SearchOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useKeyPress } from 'ahooks';
import { Button, Select, SelectProps } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { isEqual } from 'lodash';
import { BaseSelectRef } from 'rc-select';
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';

import StructuredOption, {
  StructuredOptionMode,
  StructuredOptionProps,
  StructuredOptionRef,
  StructuredOptionType,
  StructuredValue,
} from './StructuredOption';
import StructuredTag from './StructuredTag';

export type SearchDataType = { keyword?: string; structuredValue?: StructuredValue[] };
export type StructuredFilterProps = {
  size?: SizeType;
  prefix?: ReactNode;
  showSearchButton?: boolean | 'simple';
  keywordPlaceholder?: string;
  onSearch?: (value: SearchDataType) => void;
  onChange?: (value: SearchDataType) => void;
  options: StructuredOptionType[];
} & Omit<SelectProps, 'options' | 'onSearch'>;

const StructuredFilterWrapper = styled.div<{ size: SizeType }>`
  display: flex;
  .prefix {
  }
  .search-wrapper {
    flex-grow: 1;
  }
  .search-content {
    position: relative;
    display: flex;
    ${(props) =>
      props.size === 'small'
        ? `width: 133.33%;
    transform: scale(0.75);`
        : ''}
    transform-origin: top left;
    .search-inner {
      flex-grow: 1;
      margin-right: 8px;
      position: relative;
      .ant-select-selector {
        height: 36px;
      }
    }
  }
`;

const StructuredFilter: FC<StructuredFilterProps> = (props) => {
  const { showSearchButton = true, size, options, ...restProps } = props;
  const { t } = useTranslation(['common']);

  const selectRef = useRef<BaseSelectRef>(null);
  const structuredOptionRef = useRef<StructuredOptionRef>(null);

  const [focus, setFocus] = useState(false);
  const [open, setOpen] = useState(false);

  const [keyword, setKeyword] = useState<string>();
  const [filterData, setFilterData] = useImmer<StructuredValue[]>([]);

  useKeyPress(['Backspace', 'Enter'], (e) => {
    if (focus) {
      if (e.key === 'Enter') return handleSearch();
      if (e.key === 'Backspace' && !keyword) {
        setFilterData((state) => {
          state.pop();
        });
      }
    }
  });

  const handleTagOperatorClick = (data?: StructuredValue) => {
    structuredOptionRef.current?.set({ type: 'operator', data });
  };

  const handleTagValueClick = (data?: StructuredValue) => {
    structuredOptionRef.current?.set({ type: 'value', data });
  };

  const handleDeleteTag = (value?: StructuredValue) => {
    const data = filterData.filter((data) => !isEqual(value, data));
    setFilterData(data);
  };

  const handleFocus = () => {
    setFocus(true);
    setOpen(true);
  };

  const handleBlur = () => {
    setFocus(false);
    setOpen(false);
    structuredOptionRef.current?.reset();
  };

  const handleChange: StructuredOptionProps['onChange'] = (mode, value, oldValue) => {
    setOpen(false);
    selectRef.current?.blur();
    if (mode === StructuredOptionMode.modify) {
      setFilterData((state) => {
        const index = state.findIndex((item) => isEqual(item, oldValue));
        index >= 0 && (state[index] = value);
      });
    } else if (mode === StructuredOptionMode.append) {
      setFilterData((state) => {
        state.push(value);
      });
    }
  };

  useEffect(() => {
    props.onChange?.({ structuredValue: filterData, keyword });
  }, [filterData, keyword]);

  const handleSearch = () => {
    setOpen(false);
    props.onSearch?.({ structuredValue: filterData, keyword });
  };

  return (
    <StructuredFilterWrapper size={size}>
      <div className='prefix'>{props.prefix}</div>

      <div className='search-wrapper'>
        <div className='search-content'>
          <Select
            {...restProps}
            showArrow
            allowClear
            ref={selectRef}
            className='search-inner'
            mode='multiple'
            size={size}
            open={open}
            suffixIcon={<SearchOutlined />}
            tagRender={(props) => (
              <StructuredTag
                {...props}
                onOperatorClick={handleTagOperatorClick}
                onValueClick={handleTagValueClick}
                onDelete={handleDeleteTag}
              />
            )}
            value={filterData.map((data) => JSON.stringify(data))}
            searchValue={keyword}
            autoClearSearchValue={false}
            dropdownRender={() => (
              <StructuredOption
                ref={structuredOptionRef}
                size={size}
                keyword={keyword}
                keywordPlaceholder={props.keywordPlaceholder}
                options={options}
                onChange={handleChange}
                onSearch={handleSearch}
              />
            )}
            onSearch={setKeyword}
            onClear={() => setFilterData([])}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          {showSearchButton && (
            <Button icon={<SearchOutlined />} onClick={handleSearch} style={{ height: '36px' }}>
              {showSearchButton !== 'simple' && t('search')}
            </Button>
          )}
        </div>
      </div>
    </StructuredFilterWrapper>
  );
};

export default StructuredFilter;
