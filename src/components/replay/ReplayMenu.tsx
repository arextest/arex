import { FC } from 'react';

import ReplayService from '../../services/Replay.service';
import { ApplicationDataType } from '../../services/Replay.type';
import MenuSelect from '../MenuSelect';

const ReplayMenu: FC<{ onSelect: (app: ApplicationDataType) => void }> = (props) => {
  return (
    <MenuSelect<ApplicationDataType>
      rowKey='appId'
      onSelect={props.onSelect}
      placeholder='applicationsMenu.appFilterPlaceholder'
      request={ReplayService.regressionList}
      filter={(keyword, app) => app.appName.includes(keyword) || app.appId.includes(keyword)}
      itemRender={(app) => ({
        label: `${app.appId}_${app.appName}`,
        key: app.appId,
      })}
    />
  );
};

export default ReplayMenu;
