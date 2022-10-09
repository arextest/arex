import { css } from '@emotion/react';
import { CSSInterpolation } from '@emotion/serialize/types';
import styled from '@emotion/styled';
import { Table, TableProps } from 'antd';
import { useState } from 'react';

type HighlightRowTableProps<T> = {
  sx?: CSSInterpolation;
  onRowClick?: (record: T) => void;
  defaultSelectFirst?: boolean;
} & TableProps<T>;

const HighlightRowTableWrapper = styled.div`
  // highlight selected row
  .clickRowStyle {
    background-color: ${(props) => props.theme.color.selected};
    td.ant-table-cell-row-hover {
      background-color: transparent !important; // use clickRowStyle background color instead
    }
  }
`;

const defaultSelectRow = { row: 0, page: 1 };
const invalidSelectRow = { row: -1, page: -1 };
function HighlightRowTable<T extends object>(props: HighlightRowTableProps<T>) {
  const { sx, defaultSelectFirst, onRowClick, onChange, ...restProps } = props;

  const [page, setPage] = useState<number>();
  const [selectRow, setSelectRow] = useState<{ row?: number; page?: number }>(
    defaultSelectFirst ? defaultSelectRow : invalidSelectRow,
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
              if (typeof index === 'number') {
                setSelectRow(
                  page === selectRow.page && index === selectRow.row
                    ? invalidSelectRow
                    : { row: index, page },
                );
                onRowClick && onRowClick(record);
              }
            },
          };
        }}
        onChange={handleChange}
        rowClassName={(record, index) =>
          page === selectRow.page && index === selectRow.row ? 'clickRowStyle' : ''
        }
        {...restProps}
      />
    </HighlightRowTableWrapper>
  );
}

export default HighlightRowTable;
