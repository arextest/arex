import { RunPane } from 'arex-common';

import FolderPane from './Folder';
import RequestPane from './Request';
const paneConfig = [
  {
    pageType: 'folder',
    element: FolderPane,
  },
  {
    pageType: 'request',
    element: RequestPane,
  },
  {
    pageType: 'case',
    element: RequestPane,
  },
  {
    pageType: 'run',
    element: RunPane,
  },
];

export default paneConfig;
