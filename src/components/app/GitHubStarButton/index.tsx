import React, { FC } from 'react';
import GitHubButton from 'react-github-btn';

import { Theme } from '../../../theme';

const GitHubStarButton: FC<{ theme: Theme }> = ({ theme }) => {
  return (
    <div style={{ height: '22px', marginLeft: '16px' }}>
      <GitHubButton
        data-text={'Star'}
        aria-label={'Star Arex on GitHub'}
        data-show-count={true}
        data-color-scheme={theme}
        title={'Star Arex'}
        href='https://github.com/arextest/arex'
      />
    </div>
  );
};

export default GitHubStarButton;
