import { NavigateFunction } from 'react-router-dom';

let navigate: NavigateFunction;

export const setNavigate = (navFunction: NavigateFunction) => {
  navigate = navFunction;
};

export const getNavigate = () => {
  return navigate;
};
