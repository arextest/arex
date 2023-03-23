import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useCustomNavigate } from '../router/useCustomRouter';
import { MainContext } from '../store/content/MainContent';

const useInit = () => {
  const { store } = useContext(MainContext);
  const params = useParams();
  const customNavigate = useCustomNavigate();
  useEffect(() => {
    customNavigate(
      `/${params.workspaceId}/workspace/${params.workspaceName}/${params.paneType}/${params.rawId}`,
    );
  }, []);
};

export default useInit;
