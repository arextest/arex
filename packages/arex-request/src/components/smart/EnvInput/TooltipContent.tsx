import React, { FC, useMemo } from 'react';

import { ArexEnvironment } from '../../../types';

export type TooltipContentProps = { match: string; mockEnvironment?: ArexEnvironment };
const TooltipContent: FC<TooltipContentProps> = (props) => {
  const env = useMemo(() => {
    const key = props.match.replace('{{', '').replace('}}', '');
    return props.mockEnvironment?.variables?.find((v) => v.key === key);
  }, [props]);

  return (
    <div className={'rhi-tooltip'}>
      <div className='content'>
        {env?.value ? (
          <div>
            {props.mockEnvironment?.name}
            <span
              style={{
                backgroundColor: 'rgb(184,187,192)',
                padding: '0 4px',
                marginLeft: '4px',
                borderRadius: '2px',
              }}
            >
              {env?.value}
            </span>
          </div>
        ) : (
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
        )}
      </div>
      <div className='shim'>
        <div className='small-triangle'></div>
      </div>
    </div>
  );
};

export default TooltipContent;
