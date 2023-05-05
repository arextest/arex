/**
 * All Pane Components under panes folder
 * should be created by createArexPane,
 * and export in this index file.
 * Note: In order to get the name of the function component,
 * do not create the function anonymously.
 */

import Environment from './Environment';
import Replay from './Replay';
import ReplayCase from './ReplayCase';
import ReplayCaseDetail from './ReplayCaseDetail';
import ReplayDiffScenes from './ReplayDiffScenes';
import Request from './Request';

export default { Replay, ReplayCase, ReplayCaseDetail, ReplayDiffScenes, Request, Environment };
