import '../replay/Analysis/DiffJsonView.css';

import { css, useTheme } from '@emotion/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { LogEntity } from '../../services/Replay.type';
import useUserProfile from '../../store/useUserProfile';
import DiffJsonTooltip from './DiffJsonTooltip';
import { genAllDiffByType } from './helper';
import VanillaJSONEditor from './VanillaJSONEditor';

export type DiffJsonViewProps = {
  height?: string | number;
  hiddenTooltip?: boolean;
  diffJson?: { left: string; right: string };
  diffPath?: LogEntity;
};

const DiffJsonView: FC<DiffJsonViewProps> = ({ diffJson, diffPath, hiddenTooltip, height }) => {
  const { t } = useTranslation(['components']);
  const { theme } = useUserProfile();
  const allDiffByType = genAllDiffByType(diffPath);

  const onClassName = (path: string[]) => {
    const pathStr = path.map((p) => (isNaN(Number(p)) ? p : Number(p)));
    if (
      allDiffByType.diff012.map((item) => JSON.stringify(item)).includes(JSON.stringify(pathStr))
    ) {
      return 'different_element_012';
    }
    if (
      allDiffByType.diff3.map((item: any) => JSON.stringify(item)).includes(JSON.stringify(pathStr))
    ) {
      return 'different_element';
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
            onClassName={onClassName}
            allDiffByType={allDiffByType}
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
            onClassName={onClassName}
            allDiffByType={allDiffByType}
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
