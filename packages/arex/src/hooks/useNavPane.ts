import { ArexPaneManager, decodeUrl, encodeUrl, Pane, StandardPathParams } from 'arex-core';
import { merge } from 'lodash';
import { useNavigate } from 'react-router-dom';

import { useWorkspaces } from '@/store';

import { useMenusPanes } from '../store';

function useNavPane() {
  const nav = useNavigate();
  const { setPanes } = useMenusPanes();
  const { activeWorkspaceId } = useWorkspaces();

  return function (pane: Pane) {
    const match = decodeUrl();

    const mergedParams = merge<
      Partial<StandardPathParams> | undefined,
      Partial<StandardPathParams>
    >(match.params, {
      workspaceId: activeWorkspaceId,
      menuType: ArexPaneManager.getMenuTypeByType(pane.type),
      paneType: pane.type,
      id: pane.id,
    });
    const mergedData = merge(match.query, pane.data);
    const url = encodeUrl(mergedParams, mergedData);

    setPanes(pane);

    return nav(url);
  };
}

export default useNavPane;
