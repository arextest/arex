import { FC } from 'react';

type Components = {
  [name: string]: FC | Components;
};

/**
 * 动态生成组件变量并注入 props
 * @param components
 * @param name
 * @param props
 */
function propsHydration<T>(components: Components, name: string, props?: T): FC<Partial<T>> {
  const path = name.split('.');
  let Component: FC | Components = components;
  path.forEach((p) => {
    Component = Component[p];
  });

  return () => <>{Component && typeof Component === 'function' && <Component {...props} />}</>;
}

export default propsHydration;
