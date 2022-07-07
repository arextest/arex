import styled from "@emotion/styled";
import { useRequest } from "ahooks";
import { Input, Menu } from "antd";
import { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { FileSystemService } from "../../api/FileSystem.service";
import { ApplicationDataType } from "../../api/FileSystem.type";

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

const ApplicationsMenu: FC<{
  onAppSelect: (app: ApplicationDataType) => void;
}> = (props) => {
  const { t } = useTranslation("components");

  const [filterKeyword, setFilterKeyword] = useState("");
  const { data: apps = [] } = useRequest(FileSystemService.regressionList, {
    onSuccess(res) {
      console.log(res);
    },
  });
  const filteredApps = useMemo(
    () =>
      filterKeyword
        ? apps.filter(
            (app) =>
              app.application.appName.includes(filterKeyword) ||
              app.application.appId.includes(filterKeyword)
          )
        : apps,
    [filterKeyword, apps]
  );

  const handleAppMenuClick = (value) => {
    const app: ApplicationDataType | undefined = apps.find(
      (app) => app.application.appId === value.key
    )?.application;
    console.log(app);
    app && props.onAppSelect(app);
  };
  return (
    <ApplicationsMenuWrapper>
      <AppFilter
        value={filterKeyword}
        placeholder={t("applicationsMenu.appFilterPlaceholder")}
        onChange={(e) => setFilterKeyword(e.target.value)}
      />
      <AppList
        items={filteredApps.map((app) => ({
          label: `${app.application.appId}_${app.application.appName}`,
          key: app.application.appId,
        }))}
        onSelect={handleAppMenuClick}
      />
    </ApplicationsMenuWrapper>
  );
};

export default ApplicationsMenu;
