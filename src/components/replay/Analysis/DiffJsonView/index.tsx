import './../DiffJsonView.css';

import { css } from '@emotion/react';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { tryParseJsonString } from '../../../../helpers/utils';
import { QueryMsgWithDiffRes } from '../../../../services/Replay.type';
import useUserProfile from '../../../../store/useUserProfile';
import { genAllDiffByType } from './helper';
import VanillaJSONEditor from './VanillaJSONEditor';

export type DiffJsonViewProps = {
  height?: string | number;
  data?: Pick<QueryMsgWithDiffRes, 'baseMsg' | 'testMsg' | 'logs'>;
};

const DiffJsonView: FC<DiffJsonViewProps> = ({ data, height }) => {
  const { t } = useTranslation(['components']);
  const { theme } = useUserProfile();

  const baseMsg = useMemo(() => {
    const msg = {
      json: data?.baseMsg,
      text: undefined,
    };
    msg.json = tryParseJsonString(data?.baseMsg);
    return msg;
  }, [data]);

  const testMsg = useMemo(() => {
    const msg = {
      json: data?.testMsg,
      text: undefined,
    };
    msg.json = tryParseJsonString(data?.testMsg);
    return msg;
  }, [data]);

  const msgWithDiff = data;
  const allDiffByType = genAllDiffByType(msgWithDiff?.logs);

  const onClassName = (path: string[]) => {
    const pathStr = path.map((p) => (isNaN(Number(p)) ? p : Number(p)));
    if (
      allDiffByType.diff012
        .map((item: any) => JSON.stringify(item))
        .includes(JSON.stringify(pathStr))
    ) {
      return 'different_element_012';
    }
    if (
      allDiffByType.diff3.map((item: any) => JSON.stringify(item)).includes(JSON.stringify(pathStr))
    ) {
      return 'different_element';
    }
  };

  if (!data) {
    return <div></div>;
  }
  return (
    <div>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        <div
          className={`MsgWithDiffLegend`}
          css={css`
            color: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.85)' : '#333'};
          `}
        >
          <div>
            <div className='color-tag-green' />
            <span>{t('replay.moreNode')}</span>
          </div>
          <div>
            <div className='color-tag-pink' />
            <span>{t('replay.differenceNode')}</span>
          </div>
          <div>
            <div className='color-tag-grey' />
            <span>{t('replay.ignoreNode')}</span>
          </div>
        </div>
      </div>

      <div
        css={css`
          display: flex;
          width: 100%;
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
            css={css`
              flex: 1;
            `}
            height={height}
            content={baseMsg}
            readOnly
            mainMenuBar={false}
            onClassName={onClassName}
            allDiffByType={allDiffByType}
          />
        </div>

        <div
          css={css`
            flex: 1;
          `}
          id={'containerRight'}
        >
          <VanillaJSONEditor
            css={css`
              flex: 1;
            `}
            height={height}
            content={testMsg}
            readOnly
            mainMenuBar={false}
            onClassName={onClassName}
            allDiffByType={allDiffByType}
          />
        </div>
      </div>
    </div>
  );
};

export default DiffJsonView;
