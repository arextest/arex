import { CompareConfigType } from '@arextest/vanilla-jsoneditor';
import { css } from '@emotion/react';
import { theme } from 'antd';
import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useArexCoreConfig } from '../../hooks';
import DiffJsonTooltip from './DiffJsonTooltip';
import { genAllDiffByType, LogEntity } from './helper';
import VanillaJSONEditor from './JSONEditor';

export enum TargetEditor {
  'left' = 'left',
  'right' = 'right',
}

export type PathHandler = (params: {
  type?: CompareConfigType;
  path: string[];
  jsonString: { [targetEditor in TargetEditor]: string };
  targetEditor: TargetEditor;
}) => void;
export type DiffJsonViewProps = {
  readOnly?: boolean;
  encrypted?: boolean;
  height?: string | number;
  hiddenTooltip?: boolean;
  diffJson?: { left: string; right: string };
  diffPath?: LogEntity[];
  remark?: [string, string];
  onIgnoreKey?: PathHandler;
  onSortKey?: PathHandler;
  onReferenceKey?: PathHandler;
  onCompressKey?: PathHandler;
  onDiffMatch?: PathHandler;
};

const { useToken } = theme;
const DiffJsonView: FC<DiffJsonViewProps> = ({
  readOnly,
  encrypted,
  diffJson,
  diffPath,
  hiddenTooltip,
  height,
  remark,
  onIgnoreKey,
  onSortKey,
  onReferenceKey,
  onCompressKey,
  onDiffMatch,
}) => {
  const { t } = useTranslation();
  const { theme, language } = useArexCoreConfig();
  const allLeftDiffByType = genAllDiffByType(TargetEditor.left, diffPath);
  const allRightDiffByType = genAllDiffByType(TargetEditor.right, diffPath);
  const onClassNameLeft = (path: string[]) => {
    const pathStr = path.map((p) => (isNaN(Number(p)) ? p : Number(p)));
    if (pathStr.length === 0) {
      // 排除空数组
      return '';
    }
    if (
      allLeftDiffByType.diff
        .map((item: any) => JSON.stringify(item))
        .includes(JSON.stringify(pathStr))
    ) {
      return 'different_element';
    }
    if (
      allLeftDiffByType.more
        .map((item: any) => JSON.stringify(item))
        .includes(JSON.stringify(pathStr))
    ) {
      return 'different_element_012';
    }
  };

  const onClassNameRight = (path: string[]) => {
    const pathStr = path.map((p) => (isNaN(Number(p)) ? p : Number(p)));
    if (
      allRightDiffByType.diff
        .map((item: any) => JSON.stringify(item))
        .includes(JSON.stringify(pathStr))
    ) {
      return 'different_element';
    }
    if (
      allRightDiffByType.more
        .map((item: any) => JSON.stringify(item))
        .includes(JSON.stringify(pathStr))
    ) {
      return 'different_element_012';
    }
  };

  const { token: emotionTheme } = useToken();

  const rightClickHandler = useCallback(
    (fn: PathHandler, path: string[], targetEditor: TargetEditor, type?: CompareConfigType) => {
      fn({
        type,
        path,
        jsonString: diffJson!,
        targetEditor,
      });
    },
    [diffJson],
  );

  if (!diffJson) return null;

  return (
    <>
      {!hiddenTooltip && <DiffJsonTooltip />}
      <div
        css={css`
          display: flex;
          height: ${height};
          width: 100%;
          #containerRight .different_element {
            background-color: ${emotionTheme.colorInfoBgHover};
          }
          #containerLeft .different_element {
            background-color: ${emotionTheme.colorInfoBgHover};
          }
          #containerRight .different_element_012 {
            background-color: ${emotionTheme.colorWarningBgHover};
          }
          #containerLeft .different_element_012 {
            background-color: ${emotionTheme.colorWarningBgHover};
          }
        `}
        id={'MsgWithDiffJsonEditorWrapper'}
        className={`${theme === 'dark' ? 'jse-theme-dark' : ''}`}
      >
        <div
          css={css`
            flex: 1;
          `}
          id={'containerLeft'}
        >
          <VanillaJSONEditor
            readOnly={readOnly}
            encrypted={encrypted}
            height={height}
            language={language}
            remark={remark?.[0] || (t('benchmark') as string)}
            content={{
              text: String(diffJson?.left), // stringify falsy value
              json: undefined,
            }}
            mainMenuBar={false}
            onClassName={onClassNameLeft}
            allDiffByType={allLeftDiffByType}
            onIgnoreKey={
              onIgnoreKey &&
              ((path, type) => rightClickHandler(onIgnoreKey, path, TargetEditor.left, type))
            }
            onSortKey={
              onSortKey &&
              ((path, type) => rightClickHandler(onSortKey, path, TargetEditor.left, type))
            }
            onReferenceKey={
              onReferenceKey &&
              ((path, type) => rightClickHandler(onReferenceKey, path, TargetEditor.left, type))
            }
            onCompressKey={
              onCompressKey &&
              ((path, type) => rightClickHandler(onCompressKey, path, TargetEditor.left, type))
            }
            onDiffMatch={
              onDiffMatch &&
              ((path, type) => rightClickHandler(onDiffMatch, path, TargetEditor.left, type))
            }
          />
        </div>

        <div
          css={css`
            flex: 1;
          `}
          id={'containerRight'}
        >
          <VanillaJSONEditor
            readOnly={readOnly}
            encrypted={encrypted}
            height={height}
            language={language}
            remark={remark?.[1] || (t('test') as string)}
            content={{
              text: String(diffJson?.right), // stringify falsy value
              json: undefined,
            }}
            mainMenuBar={false}
            onClassName={onClassNameRight}
            allDiffByType={allRightDiffByType}
            onIgnoreKey={
              onIgnoreKey &&
              ((path, type) => rightClickHandler(onIgnoreKey, path, TargetEditor.right, type))
            }
            onSortKey={
              onSortKey &&
              ((path, type) => rightClickHandler(onSortKey, path, TargetEditor.right, type))
            }
            onReferenceKey={
              onReferenceKey &&
              ((path, type) => rightClickHandler(onReferenceKey, path, TargetEditor.right, type))
            }
            onCompressKey={
              onCompressKey &&
              ((path, type) => rightClickHandler(onCompressKey, path, TargetEditor.right, type))
            }
            onDiffMatch={
              onDiffMatch &&
              ((path, type) => rightClickHandler(onDiffMatch, path, TargetEditor.right, type))
            }
          />
        </div>
      </div>
    </>
  );
};

export default DiffJsonView;
