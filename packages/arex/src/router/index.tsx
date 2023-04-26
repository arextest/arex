import { useRoutes } from 'react-router-dom';

import routes, { FreePath } from './routes';

const Routes = () => useRoutes(routes);

export default Routes;
export { FreePath };
