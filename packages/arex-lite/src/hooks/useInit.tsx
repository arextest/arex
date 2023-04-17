import { PanesManager } from 'arex-core';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import CustomPane from '../panes/CustomPane';
import { useCustomNavigate } from '../router/useCustomRouter';

const useInit = () => {
  PanesManager.registerPanes({ CustomPane });

  const params = useParams();
  const customNavigate = useCustomNavigate();
  useEffect(() => {
    customNavigate(
      `/${params.workspaceId}/workspace/${params.workspaceName}/${params.paneType}/${params.rawId}`,
    );
  }, []);
};

export default useInit;
