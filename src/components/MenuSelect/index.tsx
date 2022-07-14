import styled from "@emotion/styled";
import { useRequest } from "ahooks";
import { Input, Menu } from "antd";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type ApplicationsMenuProps<T> = {
  rowKey: string;
  onAppSelect: (app: T) => void;
  filterFn: (keyword: string, app: T) => boolean;
  request: () => Promise<T[]>;
  placeholder?: string; // from i18n namespace "components"
  defaultSelectFirst?: boolean;
  itemRender?: (app: T) => { label: string; key: React.Key };
};

const ApplicationsMenuWrapper = styled.div`
  margin: 16px 0 0 16px;
`;
const AppList = styled(Menu)`
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
const AppFilter = styled(Input.Search)`
  //padding: 0 8px;
  margin-bottom: 8px;
`;

function MenuSelect<T extends { [key: string]: any }>(
  props: ApplicationsMenuProps<T>
) {
  const { t } = useTranslation("components");

  const [filterKeyword, setFilterKeyword] = useState("");
  const [selectedKey, setSelectedKey] = useState<string>("");
  const { data: apps = [] } = useRequest<T[], any | undefined>(props.request, {
    onSuccess(res) {
      if (res.length && props.defaultSelectFirst) {
        setSelectedKey(res[0][props.rowKey]);
        props.onAppSelect(res[0]);
      }
    },
  });
  const filteredApps = useMemo(
    () =>
      filterKeyword
        ? apps.filter((app) => props.filterFn(filterKeyword, app))
        : apps,
    [filterKeyword, apps]
  );

  const handleAppMenuClick = (value: { key: string }) => {
    const app: T | undefined = apps.find(
      (app) => app[props.rowKey] === value.key
    );
    if (app) {
      props.onAppSelect(app);
      setSelectedKey(app[props.rowKey]);
    }
  };
  return (
    <ApplicationsMenuWrapper>
      <AppFilter
        value={filterKeyword}
        placeholder={props.placeholder && t(props.placeholder)}
        onChange={(e) => setFilterKeyword(e.target.value)}
      />
      <AppList
        selectedKeys={[selectedKey]}
        items={filteredApps.map(
          props.itemRender
            ? props.itemRender
            : (app) => ({
                label: app[props.rowKey],
                key: app[props.rowKey],
              })
        )}
        onSelect={handleAppMenuClick}
      />
    </ApplicationsMenuWrapper>
  );
}

export default MenuSelect;
