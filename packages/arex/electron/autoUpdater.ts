import { app, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import logger from 'electron-log';
import { getLocalData, setLocalData, sleep } from './helper';

export async function autoUpdateInit() {
  await sleep(5000);
  //每次启动自动更新检查 更新版本 --可以根据自己方式更新，定时或者什么
  autoUpdater.checkForUpdates();

  autoUpdater.logger = logger;
  autoUpdater.disableWebInstaller = false;
  autoUpdater.autoDownload = false;
  autoUpdater.on('error', (error) => {
    logger.error(['检查更新失败', error]);
  });
  //当有可用更新的时候触发。 更新将自动下载。
  autoUpdater.on('update-available', (info) => {
    logger.info('检查到有更新，开始下载新版本');
    logger.info(info);
    const { version } = info;
    askUpdate(version);
  });
  //当没有可用更新的时候触发。
  autoUpdater.on('update-not-available', () => {
    logger.info('没有可用更新');
  });
  // 在应用程序启动时设置差分下载逻辑
  autoUpdater.on('download-progress', async (progress) => {
    logger.info(progress);
  });
  //在更新下载完成的时候触发。
  autoUpdater.on('update-downloaded', (res) => {
    logger.info('下载完毕！提示安装更新');
    logger.info(res);
    //dialog 想要使用，必须在BrowserWindow创建之后
    dialog
      .showMessageBox({
        title: '升级提示！',
        message: '已为您下载最新应用，点击确定马上替换为最新版本！',
      })
      .then(() => {
        logger.info('退出应用，安装开始！');
        //重启应用并在下载后安装更新。 它只应在发出 update-downloaded 后方可被调用。
        autoUpdater.quitAndInstall();
      });
  });
}

async function askUpdate(version) {
  logger.info(`最新版本 ${version}`);
  let { updater } = getLocalData();
  let { auto, version: ver, skip } = updater || {};
  logger.info(
    JSON.stringify({
      ...updater,
      ver,
    }),
  );
  if (skip && version === ver) return;
  if (auto) {
    // 不再询问 直接下载更新
    autoUpdater.downloadUpdate();
  } else {
    const { response, checkboxChecked } = await dialog.showMessageBox({
      type: 'info',
      buttons: ['关闭', '跳过这个版本', '安装更新'],
      title: '软件更新提醒',
      message: `arex 最新版本是 ${version}，您现在的版本是 ${app.getVersion()}，现在要下载更新吗？`,
      defaultId: 2,
      cancelId: -1,
      checkboxLabel: '以后自动下载并安装更新',
      checkboxChecked: false,
      textWidth: 300,
    });
    if ([1, 2].includes(response)) {
      let updaterData = {
        version: version,
        skip: response === 1,
        auto: checkboxChecked,
      };
      setLocalData({
        updater: {
          ...updaterData,
        },
      });
      if (response === 2) autoUpdater.downloadUpdate();
      logger.info(['更新操作', JSON.stringify(updaterData)]);
    } else {
      logger.info(['更新操作', '关闭更新提醒']);
    }
  }
}
