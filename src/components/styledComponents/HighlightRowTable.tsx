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

function HighlightRowTable<T extends object>(props: HighlightRowTableProps<T>) {
  const [selectRow, setSelectRow] = useState<number>(props.defaultSelectFirst ? 0 : -1);

  const InnerTable = styled((_props: HighlightRowTableProps<T>) => {
    return (
      <Table<T>
        onRow={(record, index) => {
          return {
            onClick: () => {
              if (typeof index === 'number') {
                setSelectRow(index === selectRow ? -1 : index);
                _props.onRowClick && _props.onRowClick(record);
              }
            },
          };
        }}
        rowClassName={(record, index) => (index === selectRow ? 'clickRowStyle' : '')}
        {..._props}
      />
    );
  })`
    // highlight selected row
    .clickRowStyle {
      background-color: ${(props) => props.theme.color.selected};
      td.ant-table-cell-row-hover {
        background-color: transparent !important; // use clickRowStyle background color instead
      }
    }
  `;
  return <InnerTable css={css(props.sx)} {...props} />;
}

export default HighlightRowTable;
