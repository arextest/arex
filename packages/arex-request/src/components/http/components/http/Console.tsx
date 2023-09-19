import { css, useTheme } from '@emotion/react';
import { theme } from 'antd';
import { FC, useContext } from 'react';
import ReactJson from 'react-json-view';

import { Context } from '../../../../providers/ConfigProvider';
const { useToken } = theme;
const Console: FC<{ logs: any[] }> = ({ logs }) => {
  const theme1 = useToken();
  const { store } = useContext(Context);
  return (
    <div
      css={css`
        border-left: 1px solid ${theme1.token.colorBorder};
        border-top: 1px solid ${theme1.token.colorBorder};
      `}
    >
      {logs.map((log, index) => {
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
                    border-right: 1px solid ${theme1.token.colorBorder};
                    border-bottom: 1px solid ${theme1.token.colorBorder};
                    padding: 10px;
                    flex: 1;
                  `}
                >
                  <ReactJson
                    theme={store.theme === 'dark' ? 'google' : undefined}
                    collapsed={1}
                    name={false}
                    src={l}
                  ></ReactJson>
                </div>
              ) : (
                <div
                  key={lIndex}
                  css={css`
                    flex: 1;
                    padding: 10px;
                    border-right: 1px solid ${theme1.token.colorBorder};
                    border-bottom: 1px solid ${theme1.token.colorBorder};
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
