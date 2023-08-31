import '@arextest/vanilla-jsoneditor/themes/jse-theme-dark.css';

import { CompareConfigType } from '@arextest/vanilla-jsoneditor';
import { css } from '@emotion/react';
import { theme } from 'antd';
import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useArexCoreConfig } from '../../hooks';
import DiffJsonTooltip from './DiffJsonTooltip';
import { genAllDiffByType, LogEntity } from './helper';
import VanillaJSONEditor from './VanillaJSONEditor';

/**
 *  过滤 path[] 中的的数组 index 类型元素
 * @param path
 * @param jsonString
 */
function validateJsonPath(path: string[], jsonString: string) {
  try {
    const json = JSON.parse(jsonString);
    const { pathList } = path.reduce<{ json: any; pathList: string[] }>(
      (jsonPathData, path) => {
        if (Array.isArray(jsonPathData.json) && Number.isInteger(Number(path))) {
          jsonPathData.json = jsonPathData.json[Number(path)];
        } else {
          jsonPathData.json = jsonPathData.json[path];
          jsonPathData.pathList.push(path);
        }
        return jsonPathData;
      },
      { json, pathList: [] },
    );
    return pathList;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export type TargetEditor = 'left' | 'right';
export type PathHandler = (params: {
  type?: CompareConfigType;
  path: string[];
  jsonString: string;
  targetEditor: TargetEditor;
}) => void;
export type DiffJsonViewProps = {
  readOnly?: boolean;
  height?: string | number;
  hiddenTooltip?: boolean;
  diffJson?: { left: string; right: string };
  diffPath?: LogEntity[];
  remark?: [string, string];
  onIgnoreKey?: PathHandler;
  onSortKey?: PathHandler;
  onReferenceKey?: PathHandler;
  onCompressKey?: PathHandler;
};

const { useToken } = theme;
const DiffJsonView: FC<DiffJsonViewProps> = ({
  readOnly,
  diffJson,
  diffPath,
  hiddenTooltip,
  height,
  remark,
  onIgnoreKey,
  onSortKey,
  onReferenceKey,
  onCompressKey,
}) => {
  const { t } = useTranslation();
  const { theme, language } = useArexCoreConfig();
  const allLeftDiffByType = genAllDiffByType('left', diffPath);
  const allRightDiffByType = genAllDiffByType('right', diffPath);
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
      const validatedPath = validateJsonPath(path, diffJson![targetEditor]);
      validatedPath &&
        fn({
          type,
          path: validatedPath,
          jsonString: diffJson![targetEditor],
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
              onIgnoreKey && ((path, type) => rightClickHandler(onIgnoreKey, path, 'left', type))
            }
            onSortKey={
              onSortKey && ((path, type) => rightClickHandler(onSortKey, path, 'left', type))
            }
            onReferenceKey={
              onReferenceKey &&
              ((path, type) => rightClickHandler(onReferenceKey, path, 'left', type))
            }
            onCompressKey={
              onCompressKey &&
              ((path, type) => rightClickHandler(onCompressKey, path, 'left', type))
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
              onIgnoreKey && ((path, type) => rightClickHandler(onIgnoreKey, path, 'right', type))
            }
            onSortKey={
              onSortKey && ((path, type) => rightClickHandler(onSortKey, path, 'right', type))
            }
            onReferenceKey={
              onReferenceKey &&
              ((path, type) => rightClickHandler(onReferenceKey, path, 'right', type))
            }
            onCompressKey={
              onCompressKey &&
              ((path, type) => rightClickHandler(onCompressKey, path, 'right', type))
            }
          />
        </div>
      </div>
    </>
  );
};

export default DiffJsonView;
