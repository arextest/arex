import React, { FC } from 'react';

const TooltipContent: FC<{ match: any; mockEnvironment: any }> = ({ match, mockEnvironment }) => {
  const key = match.replace('{{', '').replace('}}', '');
  const v = mockEnvironment.variables.find((v: any) => v.key === key);
  return (
    <div className={'rhi-tooltip'}>
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
