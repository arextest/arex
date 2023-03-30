import { FilterOutlined, PlayCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, MenuProps } from 'antd';
import { FC } from 'react';

import TooltipButton from '../../components/TooltipButton';

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
  );
};

export default SearchHeader;
