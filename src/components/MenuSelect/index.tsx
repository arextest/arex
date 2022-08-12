import { css } from '@emotion/react';
import { CSSInterpolation } from '@emotion/serialize/types';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Options } from 'ahooks/lib/useRequest/src/types';
import { Input, Menu, Spin } from 'antd';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type MenuSelectProps<D, P extends any[]> = {
  small?: boolean;
  rowKey: string;
  onSelect: (app: D) => void;
  filter?: ((keyword: string, app: D) => boolean) | string;
  request: () => Promise<D[]>;
  requestOptions?: Options<D[], P>;
  placeholder?: string; // from i18n namespace "components"
  defaultSelectFirst?: boolean;
  itemRender?: (app: D, index: number) => { label: string; key: React.Key };
};

const MenuSelectWrapper = styled.div`
  height: 100%;
  padding: 8px;
  .ant-spin-nested-loading,
  .ant-spin {
    height: 100%;
    max-height: 100% !important;
  }
`;
const MenuList = styled(Menu, { shouldForwardProp: (propName) => propName !== 'small' })<{
  small?: boolean;
}>`
  border: none !important;
  background: transparent !important;
  .ant-menu-item {
    margin: 4px 0 !important;
    height: ${(props) => (props.small ? '24px' : '28px')};
    line-height: ${(props) => (props.small ? '24px' : '28px')};
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

function MenuSelect<D extends { [key: string]: any }, P extends any[] = []>(
  props: MenuSelectProps<D, P> & { sx?: CSSInterpolation },
) {
  const { t } = useTranslation('components');

  const [filterKeyword, setFilterKeyword] = useState('');
  const [selectedKey, setSelectedKey] = useState<string>();
  const { data: apps = [], loading } = useRequest<D[], P>(props.request, {
    onSuccess(res) {
      if (res.length && props.defaultSelectFirst) {
        setSelectedKey(res[0][props.rowKey]);
        props.onSelect(res[0]);
      }
    },
    ...props.requestOptions,
  });
  const filteredApps = useMemo(
    () =>
      filterKeyword && props.filter
        ? apps.filter((app) => {
            if (typeof props.filter === 'string') {
              return app[props.filter].includes(filterKeyword);
            } else {
              return props.filter && props.filter(filterKeyword, app);
            }
          })
        : apps,
    [filterKeyword, apps],
  );

  const handleAppMenuClick = (value: { key: string }) => {
    const app: D | undefined = apps.find((app) => app[props.rowKey] === value.key);
    if (app) {
      props.onSelect(app);
      setSelectedKey(app[props.rowKey]);
    }
  };
  return (
    <MenuSelectWrapper css={css(props.sx)}>
      <Spin spinning={loading}>
        {props.filter && (
          <MenuFilter
            size={props.small ? 'small' : 'middle'}
            value={filterKeyword}
            placeholder={props.placeholder && t(props.placeholder)}
            onChange={(e) => setFilterKeyword(e.target.value)}
          />
        )}
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
      </Spin>
    </MenuSelectWrapper>
  );
}

export default MenuSelect;
