import { FilterOutlined, PlayCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, MenuProps, message, Space } from 'antd';
import { FC } from 'react';

import TooltipButton from '../../TooltipButton';

const SearchHeader: FC<{ onClickRunCompare: () => void }> = ({ onClickRunCompare }) => {
  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'compare') {
      onClickRunCompare();
    }
  };

  const items: MenuProps['items'] = [
    {
      label: 'compare',
      key: 'compare',
    },
  ];
  return (
    <div>
      <div className={'collection-header'}>
        <TooltipButton
          icon={<PlusOutlined />}
          type='text'
          size='small'
          className={'collection-header-create'}
          onClick={() => {
            console.log('');
          }}
          placement='bottomLeft'
          title={'collection.create_new'}
        />

        <Dropdown
          menu={{
            items: items,
            onClick,
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Button type={'text'} size={'small'}>
              <PlayCircleOutlined />
            </Button>
          </a>
        </Dropdown>

        <Input
          className={'collection-header-search'}
          size='small'
          placeholder=''
          prefix={<FilterOutlined />}
          onChange={() => {
            console.log('');
          }}
        />
      </div>
    </div>
  );
};

export default SearchHeader;
