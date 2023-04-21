import { decodeUrl, encodeUrl, StandardPathParams } from 'arex-core';
import { useNavigate } from 'react-router-dom';

import { useMenusPanes } from '../store';
import { encodePaneKey } from '../store/useMenusPanes';

function useNavPane(options?: { updateMenusPanesStore: boolean }) {
  const { updateMenusPanesStore = true } = options || {};
  const nav = useNavigate();
  const { setActivePane, setActiveMenu } = useMenusPanes();

  return function (
    pathParams: {
      workspaceId?: string;
      menuType?: string;
      paneType?: string;
      id?: string;
    },
    data?: object,
  ) {
    const match = decodeUrl();

    const mergedParams = { ...match.params, ...pathParams } as StandardPathParams;
    const mergedData = { ...match.query, ...data };
    const url = encodeUrl(mergedParams, mergedData);

    if (updateMenusPanesStore) {
      setActivePane(encodePaneKey({ type: mergedParams.paneType, id: mergedParams.id }));
      setActiveMenu(mergedParams.menuType);
    }

    return nav(url);
  };
}

export default useNavPane;
