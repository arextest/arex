import { css, Theme, useArexCoreConfig } from '@arextest/arex-core';
import { theme } from 'antd';
import { FC } from 'react';
import ReactJson from 'react-json-view';

const { useToken } = theme;
const Console: FC<{ logs?: any[] }> = ({ logs }) => {
  const { theme } = useArexCoreConfig();
  const { token } = useToken();
  return (
    <div
      css={css`
        border-left: 1px solid ${token.colorBorder};
        border-top: 1px solid ${token.colorBorder};
      `}
    >
      {logs?.map((log, index) => {
        return (
          <div
            key={index}
            css={css`
              display: flex;
            `}
          >
            {log.map((l: any, lIndex: number) => {
              return typeof l === 'object' ? (
                <div
                  key={lIndex}
                  css={css`
                    border-right: 1px solid ${token.colorBorder};
                    border-bottom: 1px solid ${token.colorBorder};
                    padding: 10px;
                    flex: 1;
                  `}
                >
                  <ReactJson
                    theme={theme === Theme.dark ? 'google' : undefined}
                    collapsed={1}
                    name={false}
                    src={l}
                  />
                </div>
              ) : (
                <div
                  key={lIndex}
                  css={css`
                    flex: 1;
                    padding: 10px;
                    border-right: 1px solid ${token.colorBorder};
                    border-bottom: 1px solid ${token.colorBorder};
                  `}
                >
                  <span>{l}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Console;
