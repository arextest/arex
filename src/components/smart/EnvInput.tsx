import { EditorState, StateField } from '@codemirror/state';
import { EditorView, hoverTooltip, showTooltip, Tooltip } from '@codemirror/view';
import { css } from '@emotion/react';
import { FC, useRef } from 'react';

import { useEnvCodeMirror } from '../../helpers/editor/extensions/EnvCodeMirror';
import { useStore } from '../../store';

interface SmartEnvInputProps {
  value: string;
  onChange: (e: any) => void;
}

function getEnvValue(text) {
  const editorValueMatch = text.match(/\{\{(.+?)\}\}/g);
  return editorValueMatch[0].replace('{{', '').replace('}}', '');
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
          console.log(view, pos, side);
          const { from, to, text } = view.state.doc.lineAt(pos);

          console.log(
            text,
            getEnvValue(text),
            currentEnvironment.keyValues.find((i) => i.key === getEnvValue(text)),
            'text',
          );

          if (pos < 8 || pos > 23) {
            return null;
          }

          return {
            pos: pos,
            end: pos,
            above: true,
            create(view) {
              const dom = document.createElement('span');
              const xmp = document.createElement('xmp');
              xmp.textContent = currentEnvironment.keyValues.find(
                (i) => i.key === getEnvValue(text),
              ).value;
              dom.appendChild(document.createTextNode(`${currentEnvironment.envName} `));
              dom.appendChild(xmp);
              dom.className = 'tooltip-theme';
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
      <div>{JSON.stringify(currentEnvironment)}</div>
      <div ref={smartEnvInputRef}></div>
    </div>
  );
};

export default SmartEnvInput;
