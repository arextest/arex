import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Input, Menu } from 'antd';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CSSInterpolation } from '@emotion/serialize/types';
import { css } from '@emotion/react';

type MenuSelectProps<T> = {
  small?: boolean;
  rowKey: string;
  onSelect: (app: T) => void;
  filter: (keyword: string, app: T) => boolean;
  request: () => Promise<T[]>;
  placeholder?: string; // from i18n namespace "components"
  defaultSelectFirst?: boolean;
  itemRender?: (app: T, index: number) => { label: string; key: React.Key };
};

const MenuSelectWrapper = styled.div`
  padding: 8px;
`;
const MenuList = styled(Menu)<{ small?: boolean }>`
  border: none !important;
  background: transparent !important;
  .ant-menu-item {
    margin: 4px 0 !important;
    height: ${(props) => (props.small ? '24px' : '32px')};
    line-height: ${(props) => (props.small ? '24px' : '32px')};
    border-radius: 2px;
    background: transparent !important;
  }
  .ant-menu-item-active {
    color: inherit !important;
    background-color: ${(props) => props.theme.color.active} !important;
  }
  .ant-menu-item-selected {
    background-color: ${(props) => props.theme.color.selected} !important;
  }
  .ant-menu-item-active.ant-menu-item-selected {
    color: ${(props) => props.theme.color.primary} !important;
  }
`;
const MenuFilter = styled(Input.Search)`
  margin-bottom: 8px;
`;

function MenuSelect<T extends { [key: string]: any }>(
  props: MenuSelectProps<T> & { sx?: CSSInterpolation },
) {
  const { t } = useTranslation('components');

  const [filterKeyword, setFilterKeyword] = useState('');
  const [selectedKey, setSelectedKey] = useState<string>();
  const { data: apps = [] } = useRequest<T[], any | undefined>(props.request, {
    onSuccess(res) {
      if (res.length && props.defaultSelectFirst) {
        setSelectedKey(res[0][props.rowKey]);
        props.onSelect(res[0]);
      }
    },
  });
  const filteredApps = useMemo(
    () => (filterKeyword ? apps.filter((app) => props.filter(filterKeyword, app)) : apps),
    [filterKeyword, apps],
  );

  const handleAppMenuClick = (value: { key: string }) => {
    const app: T | undefined = apps.find((app) => app[props.rowKey] === value.key);
    if (app) {
      props.onSelect(app);
      setSelectedKey(app[props.rowKey]);
    }
  };
  return (
    <MenuSelectWrapper css={css(props.sx)}>
      <MenuFilter
        value={filterKeyword}
        placeholder={props.placeholder && t(props.placeholder)}
        onChange={(e) => setFilterKeyword(e.target.value)}
      />
      <MenuList
        small={props.small}
        selectedKeys={selectedKey ? [selectedKey] : []}
        items={filteredApps.map(
          props.itemRender
            ? props.itemRender
            : (app) => ({
                label: app[props.rowKey],
                key: app[props.rowKey],
              }),
        )}
        onClick={handleAppMenuClick}
      />
    </MenuSelectWrapper>
  );
}

export default MenuSelect;
