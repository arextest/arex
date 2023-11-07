import { css } from '@emotion/react';
import { CSSInterpolation } from '@emotion/serialize/types';
import styled from '@emotion/styled';
import { Table, TablePaginationConfig, TableProps } from 'antd';
import React, { useState } from 'react';

const defaultSelectRow = { row: 0, page: 1 };
const invalidSelectRow = { row: -1, page: -1 };

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
  defaultCurrent?: number; // should be defined at the same time as defaultRow
  defaultRow?: number; // should be defined at the same time as defaultCurrent
  defaultSelectFirst?: boolean;
  restHighlight?: boolean; // reset highlight when click the same row
  onRowClick?: (record: T, index?: number) => void;
} & TableProps<T>;

function HighlightRowTable<T extends object>(props: HighlightRowTableProps<T>) {
  const {
    sx,
    defaultSelectFirst,
    defaultRow = 0,
    defaultCurrent = 1,
    restHighlight = true,
    onRowClick,
    onChange,
    ...restProps
  } = props;

  const [page, setPage] = useState<number | undefined>(defaultCurrent);
  const [selectRow, setSelectRow] = useState<{ row?: number; page?: number }>(
    defaultSelectFirst
      ? defaultSelectRow
      : props.defaultCurrent !== undefined && props.defaultRow !== undefined
      ? { row: defaultRow, page: defaultCurrent }
      : invalidSelectRow,
  );

  const handleChange: TableProps<T>['onChange'] = (pagination, ...restParams) => {
    setPage(pagination.current);
    onChange && onChange(pagination, ...restParams);
  };

  return (
    <HighlightRowTableWrapper css={css(sx)}>
      <Table<T>
        onRow={(record, index) => {
          return {
            onClick: () => {
              setSelectRow(
                ((props.pagination as TablePaginationConfig)?.current || page) === selectRow.page &&
                  index === selectRow.row &&
                  restHighlight
                  ? invalidSelectRow
                  : {
                      row: index,
                      page: (props.pagination as TablePaginationConfig)?.current || page,
                    },
              );
              onRowClick?.(record, index);
            },
          };
        }}
        onChange={handleChange}
        rowClassName={(record, index) =>
          ((props.pagination as TablePaginationConfig)?.current || page) === selectRow.page &&
          index === selectRow.row
            ? 'clickRowStyle'
            : ''
        }
        {...restProps}
      />
    </HighlightRowTableWrapper>
  );
}

export default HighlightRowTable;
