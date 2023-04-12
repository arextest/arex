import { css } from '@emotion/react';
import { Allotment } from 'allotment';
import React, { FC, ReactNode, useEffect, useState } from 'react';

import { getLocalStorage, setLocalStorage, tryParseJsonString } from '../utils';

type PaneEvent = {
  max: number;
  min: number;
  size: number;
};

function calculatePercentage(a: number, b: number) {
  a = Number(a);
  b = Number(b);
  if (a + b === 0) {
    return 0;
  } else {
    return a / (a + b);
  }
}

export interface ArexMainContainerProps {
  menus: ReactNode;
  panes: ReactNode;
  vertical: boolean;
  layoutId: string;
  height: string;
}

const ArexMainContainer: FC<ArexMainContainerProps> = (props) => {
  const [panePrimarySize, setPanePrimarySize] = useState(35);
  const [paneSecondarySize, setPaneSecondarySize] = useState(65);
  function getPaneData(type: 'vertical' | 'horizontal'): PaneEvent[] | null {
    const storageKey = `${props.layoutId}-pane-config-${type}`;
    const paneEvent = getLocalStorage(storageKey);
    if (!paneEvent) return null;
    return tryParseJsonString(paneEvent);
  }

  useEffect(() => {
    if (!props.layoutId) return;

    const verticalPaneData = getPaneData(props.vertical ? 'vertical' : 'horizontal');
    if (verticalPaneData) {
      const [mainPane, sidebarPane] = verticalPaneData;

      const p = calculatePercentage(mainPane?.size || 0, sidebarPane?.size || 0) * 100;
      setPanePrimarySize(p);
      setPaneSecondarySize(100 - p);
    }
  }, []);

  return (
    <Allotment
      css={css`
        height: ${props.height};
      `}
      vertical={props.vertical}
      onChange={(sizes) => {
        const type = props.vertical ? 'vertical' : 'horizontal';
        const storageKey = `${props.layoutId}-pane-config-${type}`;
        setLocalStorage(
          storageKey,
          sizes.map((size) => ({ min: 0, max: 100, size })),
        );
      }}
    >
      <Allotment.Pane preferredSize={`${panePrimarySize}%`}>{props.menus}</Allotment.Pane>
      <Allotment.Pane preferredSize={`${paneSecondarySize}%`}>{props.panes}</Allotment.Pane>
    </Allotment>
  );
};

export default ArexMainContainer;
