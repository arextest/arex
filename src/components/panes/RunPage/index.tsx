import { useLocation, useParams } from 'react-router-dom';

import RunCreatePane from './RunCreate';
import RunResultPane from './RunResult';

const RunPane = ({ pane }: any) => {
  const pam = useParams();
  return (
    <div>
      {pam.rawId === 'create' && <RunCreatePane />}
      {pam.rawId !== 'create' && <RunResultPane />}
    </div>
  );
};

export default RunPane;
