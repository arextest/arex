import { FC } from 'react';
import React from 'react';
import GitHubButton from 'react-github-btn';
const GitHubStarButton: FC<{ theme: string }> = ({ theme }) => {
  return (
    <div style={{ height: '22px', marginLeft: '16px' }}>
      <GitHubButton
        data-text={'Star'}
        aria-label={'Star Arex on GitHub'}
        data-show-count={true}
        data-color-scheme={theme}
        title={'Star Arex'}
        href='https://github.com/evaporator-project/evaporator'
      />
    </div>
  );
};

export default GitHubStarButton;
