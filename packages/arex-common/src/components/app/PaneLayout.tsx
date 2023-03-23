import { css } from '@emotion/react';
import { Allotment } from 'allotment';
import React, { FC, useEffect, useState } from 'react';

import { getLocalConfig, setLocalConfig } from '../../newStore/ls';
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
interface AppPaneLayoutProps {
  primary: any;
  secondary: any;
  vertical: boolean;
  layoutId: string;
  height: string;
}
const AppPaneLayout: FC<AppPaneLayoutProps> = ({
  primary,
  secondary,
  vertical,
  layoutId,
  height,
}) => {
  const [panePrimarySize, setPanePrimarySize] = useState(35);
  const [paneSecondarySize, setPaneSecondarySize] = useState(65);
  function getPaneData(type: 'vertical' | 'horizontal'): PaneEvent[] | null {
    const storageKey = `${layoutId}-pane-config-${type}`;
    const paneEvent = getLocalConfig(storageKey);
    if (!paneEvent) return null;
    return JSON.parse(paneEvent);
  }
  function populatePaneEvent() {
    if (!layoutId) return;

    const verticalPaneData = getPaneData(vertical ? 'vertical' : 'horizontal');
    if (verticalPaneData) {
      const [mainPane, sidebarPane] = verticalPaneData;

      const p = calculatePercentage(mainPane?.size || 0, sidebarPane?.size || 0) * 100;
      setPanePrimarySize(p);
      setPaneSecondarySize(100 - p);
    }
  }

  useEffect(() => {
    populatePaneEvent();
  }, []);
  return (
    <div css={css``}>
      <Allotment
        css={css`
          height: ${height};
        `}
        vertical={vertical}
        onChange={(sizes) => {
          const type = vertical ? 'vertical' : 'horizontal';
          const storageKey = `${layoutId}-pane-config-${type}`;
          setLocalConfig(
            storageKey,
            JSON.stringify(sizes.map((size) => ({ min: 0, max: 100, size }))),
          );
        }}
      >
        <Allotment.Pane preferredSize={`${panePrimarySize}%`}>{primary}</Allotment.Pane>
        <Allotment.Pane preferredSize={`${paneSecondarySize}%`}>{secondary}</Allotment.Pane>
      </Allotment>
    </div>
  );
};

export default AppPaneLayout;
