import { hoverTooltip } from '@codemirror/view';
import { css } from '@emotion/react';
import { FC, useRef } from 'react';

import { useEnvCodeMirror } from '../../helpers/editor/extensions/EnvCodeMirror';
import {
  getMarkFromToArr,
  HOPP_ENVIRONMENT_REGEX,
} from '../../helpers/editor/extensions/HoppEnvironment';
import { useStore } from '../../store';

interface SmartEnvInputProps {
  value: string;
  onChange: (e: any) => void;
}
const SmartEnvInput: FC<SmartEnvInputProps> = ({ value, onChange }) => {
  const smartEnvInputRef = useRef(null);
  const { currentEnvironment } = useStore();

  useEnvCodeMirror({
    container: smartEnvInputRef.current,
    value: value,
    height: '30px',
    extensions: [
      [
        hoverTooltip((view, pos, side) => {
          const { text } = view.state.doc.lineAt(pos);
          const markArrs = getMarkFromToArr(text, HOPP_ENVIRONMENT_REGEX, currentEnvironment);
          const index = markArrs.map((i) => pos < i.to && pos > i.from).findIndex((i) => i);
          if (index === -1) {
            return null;
          }
          return {
            pos: pos,
            end: pos,
            above: true,
            arrow: true,
            create(view) {
              const dom = document.createElement('div');
              dom.innerHTML = `
              <span class="name">${markArrs[index].matchEnv.name}</span>
              <span class="value">${markArrs[index].matchEnv.value}</span>
              `;
              dom.className = 'tooltip-theme1';
              return { dom };
            },
          };
        }),
      ],
    ],
    onChange: (val) => {
      onChange({
        target: {
          value: val,
        },
      });
    },
    currentEnv: currentEnvironment,
    theme: 'dark',
  });

  return (
    <div
      className={'smart-env'}
      css={css`
        width: 100%;
        display: inline-block;
        border: 1px solid #434343;
      `}
    >
      <div ref={smartEnvInputRef}></div>
    </div>
  );
};

export default SmartEnvInput;
