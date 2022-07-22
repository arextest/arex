import {ApplicationDataType} from "../../api/Replay.type";
import ReplayService from "../../api/Replay.service";
import MenuSelect from "../MenuSelect";
import {FC} from "react";

const ReplayMenu:FC<{onSelect:(app:ApplicationDataType) => void}> = (props) => {
  return (
    <MenuSelect<ApplicationDataType>
      defaultSelectFirst
      rowKey="appId"
      onSelect={props.onSelect}
      placeholder="applicationsMenu.appFilterPlaceholder"
      request={ReplayService.regressionList}
      filter={(keyword, app) =>
        app.appName.includes(keyword) || app.appId.includes(keyword)
      }
      itemRender={(app) => ({
        label: `${app.appId}_${app.appName}`,
        key: app.appId,
      })}
    />
  );
}

export default ReplayMenu;
