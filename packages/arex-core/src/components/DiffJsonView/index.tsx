import '@arextest/vanilla-jsoneditor/themes/jse-theme-dark.css';

import { css } from '@emotion/react';
import { theme } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useArexCoreConfig } from '../../hooks';
import { LogEntity } from '../DiffPath/type';
import DiffJsonTooltip from './DiffJsonTooltip';
import { genAllDiffByType } from './helper';
import VanillaJSONEditor from './VanillaJSONEditor';
export type DiffJsonViewProps = {
  height?: string | number;
  hiddenTooltip?: boolean;
  diffJson?: { left: string; right: string };
  diffPath?: LogEntity[];
  remark?: [string, string];
  onIgnoreKey?: (key: string[]) => void;
  onSortKey?: (key: string[]) => void;
};
const { useToken } = theme;
const DiffJsonView: FC<DiffJsonViewProps> = ({
  diffJson,
  diffPath,
  hiddenTooltip,
  height,
  remark,
  onIgnoreKey,
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
            height={height}
            remark={remark?.[0] || (t('record') as string)}
            content={{
              text: String(diffJson?.left), // stringify falsy value
              json: undefined,
            }}
            mainMenuBar={false}
            onClassName={onClassNameLeft}
            allDiffByType={allLeftDiffByType}
            onIgnoreKey={onIgnoreKey}
            onSortKey={onSortKey}
          />
        </div>

        <div
          css={css`
            flex: 1;
          `}
          id={'containerRight'}
        >
          <VanillaJSONEditor
            height={height}
            remark={remark?.[1] || (t('replay') as string)}
            content={{
              text: String(diffJson?.right), // stringify falsy value
              json: undefined,
            }}
            mainMenuBar={false}
            onClassName={onClassNameRight}
            allDiffByType={allRightDiffByType}
            onIgnoreKey={onIgnoreKey}
            onSortKey={onSortKey}
          />
        </div>
      </div>
    </>
  );
};

export default DiffJsonView;
