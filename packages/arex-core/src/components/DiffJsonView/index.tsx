import { css } from '@emotion/react';
import React, { forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { ContextMenuItem } from 'vanilla-jsoneditor';

import JSONEditor, { JSONEditorRef } from '../JSONEditor';
import DiffJsonTooltip from './DiffJsonTooltip';

export enum TargetEditor {
  LEFT = 'left',
  RIGHT = 'right',
}

export type OnClassName = (
  path: string[],
  value: unknown,
  target: TargetEditor,
) => string | undefined;

export type OnRenderContextMenu = (
  path: string[],
  value: unknown,
  target: TargetEditor,
) => ContextMenuItem[] | false | undefined;

export type DiffJsonViewProps = {
  readOnly?: boolean;
  hiddenValue?: boolean;
  height?: string | number;
  tooltip?: boolean;
  diffJson?: { left: string; right: string };
  remarks?: { left: string; right: string };
  onRenderContextMenu?: OnRenderContextMenu;
  onClassName?: OnClassName;
};

export type DiffJsonViewRef = {
  leftScrollTo: (path: (string | number)[]) => void;
  rightScrollTo: (path: (string | number)[]) => void;
};

const DiffJsonView = forwardRef<DiffJsonViewRef, DiffJsonViewProps>((props, ref) => {
  const { t } = useTranslation();

  const leftEditorRef = React.useRef<JSONEditorRef>(null);
  const rightEditorRef = React.useRef<JSONEditorRef>(null);

  useImperativeHandle(
    ref,
    () => ({
      leftScrollTo: (path) => leftEditorRef.current?.scrollTo(path),
      rightScrollTo: (path) => rightEditorRef.current?.scrollTo(path),
    }),
    [leftEditorRef.current, rightEditorRef.current],
  );

  if (!props.diffJson) return null;

  return (
    <>
      {props.tooltip && (
        <div style={{ marginBottom: '4px' }}>
          <DiffJsonTooltip />
        </div>
      )}

      <div
        css={css`
          display: flex;
          height: ${props.height};
          width: 100%;
        `}
      >
        <div style={{ flex: 1 }}>
          <JSONEditor
            readOnly
            ref={leftEditorRef}
            hiddenValue={props.hiddenValue}
            height={props.height}
            remark={props.remarks?.left || (t('record') as string)}
            content={{
              text: String(props.diffJson?.left), // stringify falsy value
              json: undefined,
            }}
            onClassName={(...params) => props.onClassName?.(...params, TargetEditor.LEFT)}
            onRenderContextMenu={(items, context) =>
              props.onRenderContextMenu?.(
                context.selection.path,
                context.value,
                TargetEditor.LEFT,
              ) ?? items
            }
          />
        </div>

        <div style={{ flex: 1 }}>
          <JSONEditor
            readOnly
            ref={rightEditorRef}
            hiddenValue={props.hiddenValue}
            height={props.height}
            remark={props.remarks?.right || (t('replay') as string)}
            content={{
              text: String(props.diffJson?.right), // stringify falsy value
              json: undefined,
            }}
            onClassName={(...params) => props.onClassName?.(...params, TargetEditor.RIGHT)}
            onRenderContextMenu={(items, context) =>
              props.onRenderContextMenu?.(
                context.selection.path,
                context.value,
                TargetEditor.RIGHT,
              ) ?? items
            }
          />
        </div>
      </div>
    </>
  );
});

export default DiffJsonView;
