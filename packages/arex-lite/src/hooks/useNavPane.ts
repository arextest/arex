import { matchUrlParams } from 'arex-core';
import { useNavigate } from 'react-router-dom';

function useNavPane() {
  const nav = useNavigate();

  return function (
    pathParams: {
      workspaceId?: string;
      menuType?: string;
      paneType?: string;
      id?: string;
    },
    data?: object,
  ) {
    // TODO 动态增量更新 pathParams 和 search
    // matchUrlParams('');
    // nav();
  };
}

export default useNavPane;
