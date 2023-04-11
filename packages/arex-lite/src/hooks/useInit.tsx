import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useCustomNavigate } from '../router/useCustomRouter';

const useInit = () => {
  const params = useParams();
  const customNavigate = useCustomNavigate();
  useEffect(() => {
    customNavigate(
      `/${params.workspaceId}/workspace/${params.workspaceName}/${params.paneType}/${params.rawId}`,
    );
  }, []);
};

export default useInit;
