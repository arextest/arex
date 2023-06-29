import { css } from '@emotion/react';
import { CSSInterpolation } from '@emotion/serialize/types';
import styled from '@emotion/styled';
import { Table, TablePaginationConfig, TableProps } from 'antd';
import React, { useState } from 'react';

const defaultSelectRow = { key: 0, page: 1 };
const invalidSelectRow = { key: -1, page: -1 };

const HighlightRowTableWrapper = styled.div`
  // highlight selected row
  .clickRowStyle {
    background-color: ${(props) => props.theme.colorPrimaryBg};
    td.ant-table-cell-row-hover {
      background-color: transparent !important; // use clickRowStyle background color instead
    }
  }
`;

export type HighlightRowTableProps<T extends { [key: string]: any }> = {
  sx?: CSSInterpolation;
  rowKey: string;
  defaultCurrent?: number; // should be defined at the same time as defaultRowKey
  defaultRowKey?: React.Key; // should be defined at the same time as defaultCurrent
  defaultSelectFirst?: boolean;
  onRowClick?: (record?: T, key?: string) => void; // record is undefined when fold
} & Omit<TableProps<T>, 'rowKey'>;

function HighlightRowTable<T extends { [key: string]: any }>(props: HighlightRowTableProps<T>) {
  const {
    sx,
    defaultSelectFirst,
    defaultRowKey = 0,
    defaultCurrent = 1,
    onRowClick,
    onChange,
    ...restProps
  } = props;

  const [page, setPage] = useState<number | undefined>(defaultCurrent);
  const [selectRow, setSelectRow] = useState<{ key?: React.Key; page?: number }>(
    defaultSelectFirst
      ? defaultSelectRow
      : props.defaultCurrent !== undefined && props.defaultRowKey !== undefined
      ? { key: defaultRowKey, page: defaultCurrent }
      : invalidSelectRow,
  );

  const handleChange: TableProps<T>['onChange'] = (pagination, ...restParams) => {
    setPage(pagination.current);
    onChange && onChange(pagination, ...restParams);
  };

  return (
    <HighlightRowTableWrapper css={css(sx)}>
      <Table<T>
        onRow={(record: T | undefined) => {
          return {
            onClick: () => {
              const rowKey = record?.[props.rowKey];
              const shouldFold = selectRow.key === rowKey && selectRow.page === page;
              setSelectRow(
                shouldFold
                  ? invalidSelectRow
                  : {
                      key: rowKey,
                      page: (props.pagination as TablePaginationConfig)?.current || page,
                    },
              );
              onRowClick?.(shouldFold ? undefined : record, rowKey);
            },
          };
        }}
        onChange={handleChange}
        rowClassName={(record) =>
          ((props.pagination as TablePaginationConfig)?.current || page) === selectRow.page &&
          record?.[props.rowKey] === selectRow.key
            ? 'clickRowStyle'
            : ''
        }
        {...restProps}
      />
    </HighlightRowTableWrapper>
  );
}

export default HighlightRowTable;
