import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

import { useCustomNavigate } from '../../router/useCustomNavigate';
import { useCustomSearchParams } from '../../router/useCustomSearchParams';
import { ApplicationDataType } from '../../services/Replay.type';
import { PagesType } from '../panes';
import AppMenu from './AppMenu';

const ReplayMenu: FC = () => {
  const params = useParams();
  const customNavigate = useCustomNavigate();
  const customSearchParams = useCustomSearchParams();
  const handleReplayMenuClick = (app: ApplicationDataType) => {
    customNavigate({
      path: `/${params.workspaceId}/${PagesType.Replay}/${app.id}`,
      query: {
        data: encodeURIComponent(JSON.stringify(app)),
        planId: customSearchParams.query.planId,
      },
    });
  };

  return <AppMenu onSelect={handleReplayMenuClick} />;
};

export default ReplayMenu;
