import { Typography } from 'antd';
import React, { FC } from 'react';

export type AgentScriptProps = {
  appId: string;
};

const AgentScript: FC<AgentScriptProps> = (props) => {
  return (
    <div>
      <Typography.Text style={{ display: 'block' }}>Agent Script :</Typography.Text>
      <Typography.Text code copyable>
        {`java -javaagent:</path/to/arex-agent.jar> -Darex.service.name=${props.appId} -Darex.storage.service.host=<storage.service.host:port> -jar <your-application.jar>`}
      </Typography.Text>
    </div>
  );
};

export default AgentScript;
