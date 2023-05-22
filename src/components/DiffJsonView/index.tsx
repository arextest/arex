import './DiffJsonView.css';

import { css, useTheme } from '@emotion/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { LogEntity } from '../../services/Replay.type';
import useUserProfile from '../../store/useUserProfile';
import DiffJsonTooltip from './DiffJsonTooltip';
import { genAllLeftDiffByType, genAllRightDiffByType } from './helper';
import VanillaJSONEditor from './VanillaJSONEditor';

export type DiffJsonViewProps = {
  height?: string | number;
  hiddenTooltip?: boolean;
  diffJson?: { left: string; right: string };
  diffPath?: LogEntity[];
};

const DiffJsonView: FC<DiffJsonViewProps> = ({ diffJson, diffPath, hiddenTooltip, height }) => {
  const { t } = useTranslation(['components']);
  const { theme } = useUserProfile();
  const allLeftDiffByType = genAllLeftDiffByType(diffPath);

  const allRightDiffByType = genAllRightDiffByType(diffPath);

  const onClassNameLeft = (path: string[]) => {
    const pathStr = path.map((p) => (isNaN(Number(p)) ? p : Number(p)));
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

  const emotionTheme = useTheme();

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
            readOnly
            height={height}
            remark={t('replay.benchmark')}
            content={{
              text: String(diffJson?.left), // stringify falsy value
              json: undefined,
            }}
            mainMenuBar={false}
            onClassName={onClassNameLeft}
            allDiffByType={allLeftDiffByType}
            css={css`
              flex: 1;
            `}
          />
        </div>

        <div
          css={css`
            flex: 1;
          `}
          id={'containerRight'}
        >
          <VanillaJSONEditor
            readOnly
            height={height}
            remark={t('replay.test')}
            content={{
              text: String(diffJson?.right), // stringify falsy value
              json: undefined,
            }}
            mainMenuBar={false}
            onClassName={onClassNameRight}
            allDiffByType={allRightDiffByType}
            css={css`
              flex: 1;
            `}
          />
        </div>
      </div>
    </>
  );
};

export default DiffJsonView;