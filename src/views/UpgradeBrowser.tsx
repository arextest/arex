import { css } from '@emotion/react';

const UpgradeBrowser = () => {
  return (
    <div
      css={css`
        text-align: center;
        padding-top: 45vh;
      `}
    >
      <span>
        Your chrome version is less than 89, please{' '}
        <a target={'_blank'} href={'https://www.google.com/chrome/'} rel='noreferrer'>
          upgrade chrome
        </a>
        .
      </span>
    </div>
  );
};

export default UpgradeBrowser;
