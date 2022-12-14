import React, { useEffect, useState } from 'react';
import { FCC } from '../../env';

const TabBarRecoverWrapper: FCC<any> = (props) => {
  /**
   * 临时修复 tabs-ink-bar 不显示的 bug
   * 待 issue 修复后需移除
   * issue: https://github.com/ant-design/ant-design/issues/39536
   */
  const [showTabs, setShowMenu] = useState(false);
  useEffect(() => {
    setShowMenu(true);
  }, []);

  return <>{showTabs && props.children}</>;
};

export default TabBarRecoverWrapper;
