import '@arextest/vanilla-jsoneditor/themes/jse-theme-dark.css';

import { css } from '@emotion/react';
import { theme } from 'antd';
import React, { FC } from 'react';
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
    return false;
  }
}

export type TargetEditor = 'left' | 'right';
export type PathHandler = (path: string[], jsonString: string, targetEditor: TargetEditor) => void;
export type DiffJsonViewProps = {
  readOnly?: boolean;
  height?: string | number;
  hiddenTooltip?: boolean;
  diffJson?: { left: string; right: string };
  diffPath?: LogEntity[];
  remark?: [string, string];
  onIgnoreKey?: PathHandler;
  onGlobalIgnoreKey?: PathHandler;
  onSortKey?: PathHandler;
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
  onGlobalIgnoreKey,
  onSortKey,
}) => {
  const { t } = useTranslation();
  const { theme } = useArexCoreConfig();
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
            remark={remark?.[0] || (t('benchmark') as string)}
            content={{
              text: String(diffJson?.left), // stringify falsy value
              json: undefined,
            }}
            mainMenuBar={false}
            onClassName={onClassNameLeft}
            allDiffByType={allLeftDiffByType}
            onIgnoreKey={(path) => {
              const validatedPath = validateJsonPath(path, diffJson?.left);
              validatedPath && onIgnoreKey?.(validatedPath, diffJson?.left, 'left');
            }}
            onGlobalIgnoreKey={(path) => {
              const validatedPath = validateJsonPath(path, diffJson?.left);
              validatedPath && onGlobalIgnoreKey?.(validatedPath, diffJson?.left, 'left');
            }}
            onSortKey={(path) => {
              const validatedPath = validateJsonPath(path, diffJson?.left);
              validatedPath && onSortKey?.(validatedPath, diffJson?.left, 'left');
            }}
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
            remark={remark?.[1] || (t('test') as string)}
            content={{
              text: String(diffJson?.right), // stringify falsy value
              json: undefined,
            }}
            mainMenuBar={false}
            onClassName={onClassNameRight}
            allDiffByType={allRightDiffByType}
            onIgnoreKey={(path) => {
              const validatedPath = validateJsonPath(path, diffJson?.left);
              validatedPath && onIgnoreKey?.(validatedPath, diffJson?.right, 'right');
            }}
            onGlobalIgnoreKey={(path) => {
              const validatedPath = validateJsonPath(path, diffJson?.left);
              validatedPath && onGlobalIgnoreKey?.(validatedPath, diffJson?.right, 'right');
            }}
            onSortKey={(path) => {
              const validatedPath = validateJsonPath(path, diffJson?.left);
              validatedPath && onSortKey?.(validatedPath, diffJson?.right, 'right');
            }}
          />
        </div>
      </div>
    </>
  );
};

export default DiffJsonView;
