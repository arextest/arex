import { ArexPaneManager, decodeUrl, encodeUrl, StandardPathParams } from 'arex-core';
import { useNavigate } from 'react-router-dom';

import { useMenusPanes } from '../store';
import { Pane } from '../store/useMenusPanes';

function useNavPane() {
  const nav = useNavigate();
  const { setPanes } = useMenusPanes();

  return function (pane: Pane) {
    const match = decodeUrl();

    const mergedParams = {
      ...match.params,
      ...{
        menuType: ArexPaneManager.getMenuTypeByType(pane.type),
        paneType: pane.type,
        id: pane.id,
      },
    } as StandardPathParams;
    const mergedData = { ...match.query, ...pane.data };
    const url = encodeUrl(mergedParams, mergedData);

    setPanes(pane);

    return nav(url);
  };
}

export default useNavPane;
