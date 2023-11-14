import { css } from '@emotion/react';
import { CSSInterpolation } from '@emotion/serialize/types';
import styled from '@emotion/styled';
import { Table, TableProps } from 'antd';
import React, { useEffect, useState } from 'react';

const HighlightRowTableWrapper = styled.div`
  // highlight selected row
  .clickRowStyle {
    background-color: ${(props) => props.theme.colorPrimaryBgHover};
    td.ant-table-cell-row-hover {
      background-color: transparent !important; // use clickRowStyle background color instead
    }
  }
`;

export type HighlightRowTableProps<T> = {
  sx?: CSSInterpolation;
  restHighlight?: boolean; // reset highlight when click the same row
  selectKey?: React.Key;
  onRowClick?: (record: T, index?: number) => void;
} & TableProps<T>;

function HighlightRowTable<T extends object>(props: HighlightRowTableProps<T>) {
  const {
    sx,
    restHighlight = true,
    selectKey: _selectKey,
    onRowClick,
    onChange,
    ...restProps
  } = props;

  const [selectKey, setSelectKey] = useState<React.Key>();
  useEffect(() => {
    setSelectKey(_selectKey);
  }, [_selectKey]);

  const handleChange: TableProps<T>['onChange'] = (pagination, ...restParams) => {
    // setPage(pagination.current);
    onChange?.(pagination, ...restParams);
  };

  return (
    <HighlightRowTableWrapper css={css(sx)}>
      <Table<T>
        onRow={(record, index) => {
          return {
            onClick: () => {
              const key = record[props.rowKey as keyof T] as React.Key;
              setSelectKey(key === (_selectKey ?? selectKey) && restHighlight ? undefined : key);
              onRowClick?.(record, index);
            },
          };
        }}
        onChange={handleChange}
        rowClassName={(record) =>
          (_selectKey ?? selectKey) === record[props.rowKey as keyof T] ? 'clickRowStyle' : ''
        }
        {...restProps}
      />
    </HighlightRowTableWrapper>
  );
}

export default HighlightRowTable;
