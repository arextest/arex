import { css } from '@emotion/react';
import React, { FC } from 'react';

const TooltipContent: FC<{ match: any; mockEnvironment: any }> = ({ match, mockEnvironment }) => {
  const key = match.replace('{{', '').replace('}}', '');
  const v = mockEnvironment.variables.find((v: any) => v.key === key);
  return (
    <div
      css={css`
        position: absolute;
        top: -32px;
        color: black;
        z-index: 1000;
        white-space: nowrap;
        //background-color: skyblue;

        .content {
          border-radius: 2px;
          padding: 4px;
          background-color: rgb(245, 245, 245);
          box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12),
            0 5px 12px 4px rgba(0, 0, 0, 0.09);
        }

        .shim {
          height: 6px;
        }

        .small-triangle {
          border: 4px solid rgba(0, 0, 0, 0);
          width: 0;
          height: 0;
          border-top-color: rgb(245, 245, 245);
          margin-left: 8px;
        }
      `}
    >
      <div className='content'>
        {!v?.value ? (
          <div>
            {'Choose an Environment'}

            <span
              style={{
                backgroundColor: 'rgb(184,187,192)',
                padding: '0 4px',
                marginLeft: '4px',
                borderRadius: '2px',
              }}
            >
              {'Not found'}
            </span>
          </div>
        ) : (
          <div>
            {mockEnvironment.name}
            <span
              style={{
                backgroundColor: 'rgb(184,187,192)',
                padding: '0 4px',
                marginLeft: '4px',
                borderRadius: '2px',
              }}
            >
              {v?.value}
            </span>
          </div>
        )}
      </div>
      <div className='shim'>
        <div className='small-triangle'></div>
      </div>
    </div>
  );
};

export default TooltipContent;
