import {
  ArexPaneManager,
  decodeUrl,
  encodeUrl,
  Pane,
  StandardPathParams,
} from '@arextest/arex-core';
import { merge } from 'lodash';
import { useNavigate } from 'react-router-dom';

import { useMenusPanes } from '@/store';

export type NavPaneOptions = {
  inherit?: boolean;
};

function useNavPane(options?: NavPaneOptions) {
  const nav = useNavigate();
  const { setPanes, activePane } = useMenusPanes();

  return function (pane: Pane | string) {
    const match = decodeUrl();

    if (typeof pane === 'string') {
      // only rename pane id
      const url = encodeUrl({ ...match.params, id: pane }, match.query);
      useMenusPanes.setState((state) => {
        const paneItem = state.panes.find((p) => p.id === activePane?.id);
        if (paneItem) {
          paneItem.id = pane;
          state.setActivePane(pane);
        }
      });
      return nav(url);
    }

    const mergedParams = merge<
      Partial<StandardPathParams> | undefined,
      Partial<StandardPathParams>
    >(match.params, {
      menuType: ArexPaneManager.getMenuTypeByType(pane.type),
      paneType: pane.type,
      id: pane.id,
    });
    const mergedData = options?.inherit ? merge(match.query, pane.data) : pane.data;
    const url = encodeUrl(mergedParams, mergedData);

    setPanes(pane);

    return nav(url);
  };
}

export default useNavPane;
