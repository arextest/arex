import { EditorState } from '@codemirror/state';
import { hoverTooltip } from '@codemirror/view';
import { css, useTheme } from '@emotion/react';
import React, { FC, useContext, useRef } from 'react';

import { useEnvCodeMirror } from '../../helpers/editor/extensions/EnvCodeMirror';
import {
  getMarkFromToArr,
  HOPP_ENVIRONMENT_REGEX,
} from '../../helpers/editor/extensions/HoppEnvironment';
import { HttpContext } from '../../index';

interface SmartEnvInputProps {
  disabled: boolean;
  value: string;
  onChange: (e: any) => void;
}
const SmartEnvInput: FC<SmartEnvInputProps> = ({ value, onChange, disabled }) => {
  const theme = useTheme();
  const smartEnvInputRef = useRef(null);
  const { store } = useContext(HttpContext);
  useEnvCodeMirror({
    container: smartEnvInputRef.current,
    value: value,
    height: '30px',
    extensions: [
      [
        hoverTooltip((view, pos) => {
          const { text } = view.state.doc.lineAt(pos);
          const markArrs = getMarkFromToArr(text, HOPP_ENVIRONMENT_REGEX, store.environment);
          const index = markArrs.map((i) => pos < i.to && pos > i.from).findIndex((i) => i);
          if (index === -1) {
            return null;
          }
          return {
            pos: pos,
            end: pos,
            above: true,
            arrow: true,
            create() {
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
      EditorState.readOnly.of(disabled),
    ],
    onChange: (val: string) => {
      onChange(val);
    },
    currentEnv: store.environment,
    theme: store.theme,
  });

  return (
    <div
      css={css`
        border: 1px solid ${theme.colorBorder};
        border-radius: 0 ${theme.borderRadius}px ${theme.borderRadius}px 0;
        flex: 1;
        overflow: hidden;
      `}
    >
      <div ref={smartEnvInputRef} />
    </div>
  );
};

export default SmartEnvInput;
