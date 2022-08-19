import { FC, useMemo } from 'react';

import ReplayService from '../../services/Replay.service';
import { ApplicationDataType } from '../../services/Replay.type';
import MenuSelect from '../MenuSelect';

const ReplayMenu: FC<{ value?: string; onSelect: (app: ApplicationDataType) => void }> = (
  props,
) => {
  const selectedKeys = useMemo(() => (props.value ? [props.value] : []), [props.value]);

  return (
    <MenuSelect<ApplicationDataType>
      rowKey='appId'
      selectedKeys={selectedKeys}
      onSelect={props.onSelect}
      placeholder='applicationsMenu.appFilterPlaceholder'
      request={ReplayService.regressionList}
      filter={(keyword, app) => app.appName.includes(keyword) || app.appId.includes(keyword)}
      itemRender={(app) => ({
        label: app.appId,
        key: app.appId,
      })}
    />
  );
};

export default ReplayMenu;
