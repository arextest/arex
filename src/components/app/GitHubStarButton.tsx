import GitHubButton from 'react-github-btn';

const AppGitHubStarButton = () => {
  return (
    <div style={{ height: '26px', paddingTop: '2px' }}>
      <GitHubButton
        data-text={'Star'}
        aria-label={'Star Purpleheart on GitHub'}
        data-show-count={true}
        title={'Star Purpleheart'}
        href='https://github.com/arextest/arex'
      />
    </div>
  );
};

export default AppGitHubStarButton;
