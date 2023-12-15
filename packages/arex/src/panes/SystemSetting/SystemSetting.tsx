import { ArexPaneFC } from '@arextest/arex-core';
import React from 'react';

import Advanced from './Advanced';
import UserInterface from './UserInterface';
import Version from './Version';

const SystemSetting: ArexPaneFC = () => {
  return (
    <>
      <UserInterface />
      <Version />
      <Advanced />
    </>
  );
};

export default SystemSetting;
