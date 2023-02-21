export const vConsoleHelper = () => {
  // @ts-ignore
  document.querySelector('#__vconsole > div.vc-switch').style.bottom = '28px';
  // @ts-ignore
  document.querySelector('#__vconsole > div.vc-switch').addEventListener('click', function () {
    // @ts-ignore
    document.querySelector('#__vconsole > div.vc-panel > div.vc-topbar > i:nth-child(3)').click();
  });
};
