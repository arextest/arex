import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { setNavigate } from '@/router/navigation';

const NavigationContext = createContext<NavigateFunction | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return <NavigationContext.Provider value={navigate}>{children}</NavigationContext.Provider>;
};

export const useNavigation = () => {
  return useContext(NavigationContext);
};
