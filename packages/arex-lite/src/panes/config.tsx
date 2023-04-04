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
];

export default paneConfig;
