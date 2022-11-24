import { TabsProps } from 'antd';
import React from 'react';

type Tab = {
  key: string;
  label: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  children?: React.ReactNode;
  forceRender?: boolean;
  closable?: boolean;
  closeIcon?: React.ReactNode;
  prefixCls?: string;
  tabKey?: string;
  id?: string;
  animated?: boolean;
  active?: boolean;
  destroyInactiveTabPane?: boolean;
};

type HttpProfile = {
  tabs: {
    filter?: (item: Tab) => boolean;
    extra?: TabsProps['items'];
  };
};

export const httpProfile: HttpProfile = {
  tabs: {
    extra: [],
    filter: (tab) => true,
  },
};

const config = (profile: Partial<HttpProfile>) => {
  if (profile.tabs?.extra) {
    httpProfile.tabs.extra = profile.tabs.extra.reduce((tabs, cur) => {
      if (!tabs.find((item) => item.key === cur.key)) {
        tabs.push(cur);
      }
      return tabs;
    }, profile.tabs.extra);
  }

  if (profile.tabs?.filter) {
    httpProfile.tabs.filter = profile.tabs.filter;
  }
};

export default config;
