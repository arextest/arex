import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

import { useCustomNavigate } from '../../router/useCustomNavigate';
import { ApplicationDataType } from '../../services/Replay.type';
import { PagesType } from '../panes';
import AppMenu from './AppMenu';

const ReplayMenu: FC = () => {
  const params = useParams();
  const customNavigate = useCustomNavigate();
  const handleReplayMenuClick = (app: ApplicationDataType) => {
    customNavigate(
      `/${params.workspaceId}/${params.workspaceName}/${PagesType.Replay}/${
        app.id
      }?data=${encodeURIComponent(JSON.stringify(app))}`,
    );
  };

  return <AppMenu onSelect={handleReplayMenuClick} />;
};

export default ReplayMenu;
