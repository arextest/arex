import { MoreOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Button, Dropdown } from 'antd';
import { FC } from 'react';

import { MethodEnum, methodMap } from '@/constant';
interface CollectionNodeProps {
  value: { title: string; method: MethodEnum };
}
const CollectionNode: FC<CollectionNodeProps> = ({ value }) => {
  const { method, title } = value;
  const menu = (val: any) => {
    return {
      items: [
        {
          key: '7',
          label: <span className={'dropdown-click-target'}>test</span>,
          disabled: val.nodeType !== 3,
        },
      ],
      onClick(e: any) {
        console.log(e);
      },
    };
  };

  return (
    <div
      css={css`
        display: flex;
        justify-content: space-between;
      `}
    >
      <div className={'left'}>
        {method && (
          <span
            css={css`
              color: ${methodMap[method].color};
              font-size: 12px;
              margin-right: 6px;
            `}
          >
            {method}
          </span>
        )}
        <span>{title}</span>
      </div>
      <div className='right'>
        <Dropdown menu={menu(value)} trigger={['click']}>
          <Button
            type='text'
            size='small'
            icon={<MoreOutlined style={{ fontSize: '14px' }} />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      </div>
    </div>
  );
};

export default CollectionNode;
