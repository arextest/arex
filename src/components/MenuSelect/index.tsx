import styled from "@emotion/styled";
import { useRequest } from "ahooks";
import { Input, Menu } from "antd";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type MenuSelectProps<T> = {
  rowKey: string;
  onSelect: (app: T) => void;
  filter: (keyword: string, app: T) => boolean;
  request: () => Promise<T[]>;
  placeholder?: string; // from i18n namespace "components"
  defaultSelectFirst?: boolean;
  itemRender?: (app: T, index: number) => { label: string; key: React.Key };
};

const MenuList = styled(Menu)`
  background-color: transparent !important;
  border: none !important;
  .ant-menu-item {
    margin: 0 !important;
    height: 32px;
    line-height: 32px;
    border-radius: 2px;
  }
  .ant-menu-item-selected {
    background-color: #2d244f;
  }
`;
const MenuFilter = styled(Input.Search)`
  margin-bottom: 8px;
`;

function MenuSelect<T extends { [key: string]: any }>(
  props: MenuSelectProps<T>,
) {
  const { t } = useTranslation("components");

  const [filterKeyword, setFilterKeyword] = useState("");
  const [selectedKey, setSelectedKey] = useState<string>();
  const { data: apps = [] } = useRequest<T[], any | undefined>(props.request, {
    onSuccess(res) {
      if (res.length && props.defaultSelectFirst) {
        setSelectedKey(res[0][props.rowKey]);
        props.onSelect(res[0]);
      }
    },
  });
  const filteredApps = useMemo(() =>
    filterKeyword ? apps.filter(
      (app) => props.filter(filterKeyword, app),
    ) : apps, [filterKeyword, apps]);

  const handleAppMenuClick = (value: { key: string }) => {
    const app: T | undefined = apps.find(
      (app) => app[props.rowKey] === value.key,
    );
    if (app) {
      props.onSelect(app);
      setSelectedKey(app[props.rowKey]);
    }
  };
  return (
    <>
    <MenuFilter
      value={filterKeyword}
      placeholder={props.placeholder && t(props.placeholder)}
      onChange={(e) => setFilterKeyword(e.target.value)}
    />
    <MenuList
      selectedKeys={selectedKey ? [selectedKey] : []}
      items={filteredApps.map(
        props.itemRender ? props.itemRender : (app) => ({
          label: app[props.rowKey],
          key: app[props.rowKey],
        }),
      )}
      onClick={handleAppMenuClick}
    />
    </>
  );
}

export default MenuSelect;
