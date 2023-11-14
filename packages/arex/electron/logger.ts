import logger from 'electron-log';
import { join } from 'path';
import { setLocalData } from './helper';
import { app } from 'electron';

logger.transports.file.maxSize = 1002430; // 10M
logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}';
logger.transports.file.resolvePath = () => join(app.getPath('appData'), 'logs/main.log');

setLocalData({ logsPath: join(app.getPath('appData'), 'logs/main.log') });
