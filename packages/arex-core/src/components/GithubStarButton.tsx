import { GithubOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Space } from 'antd';
import { FC } from 'react';
import React from 'react';
const GitHubStarButton: FC = () => {
  const { data } = useRequest(() =>
    fetch('https://api.github.com/repos/arextest/arex-agent-java').then((data) => data.json()),
  );
  return (
    <div id='github-star-button' style={{ transform: 'scale(0.8)' }}>
      <Space.Compact>
        <Button
          size='small'
          icon={<GithubOutlined />}
          target='_blank'
          href={'https://github.com/arextest/arex-agent-java'}
          style={data && { borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
        >
          Star
        </Button>

        {data && (
          <Button
            size='small'
            target='_blank'
            href={'https://github.com/arextest/arex-agent-java/stargazers'}
            style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0, left: -1 }}
          >
            {data?.stargazers_count}
          </Button>
        )}
      </Space.Compact>
    </div>
  );
};

export default GitHubStarButton;
