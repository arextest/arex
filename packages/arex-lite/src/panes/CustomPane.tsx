import { ArexPaneFC, createPane } from 'arex-core';
import React from 'react';

const CustomPane: ArexPaneFC = (props) => {
  return <>CustomPane</>;
};

export const CustomPaneType = 'CustomPane';

export default createPane(CustomPane, CustomPaneType);
