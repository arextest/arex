import { useEffect, useState } from 'react';

let subscriptions: any = [];
let state = false;

const setState = (newState: any) => {
  state = newState;

  // 逻辑
  const classNameDark = 'dark-mode';
  const classNameLight = 'light-mode';
  document.body.classList.add(newState ? classNameDark : classNameLight);
  document.body.classList.remove(newState ? classNameLight : classNameDark);

  subscriptions.forEach((subscription: any) => {
    subscription(state);
  });
};

const useDarkMode = () => {
  const [_, newSubscription] = useState(false);
  useEffect(() => {
    subscriptions.push(newSubscription);
    return () => {
      subscriptions = subscriptions.filter((item: any) => item !== newSubscription);
    };
  }, []);
  return {
    value: state,
    toggle: (current: any) => setState(current),
  };
};

export default useDarkMode;
