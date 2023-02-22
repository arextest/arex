import './../DiffJsonView.css';

import { css } from '@emotion/react';
import { Drawer } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { QueryMsgWithDiffLog } from '../../../../services/Replay.type';
import useUserProfile from '../../../../store/useUserProfile';
import { genAllDiffByType } from './helper';
import VanillaJSONEditor from './VanillaJSONEditor';
export type DiffJsonViewProps = {
  data?: {
    baseMsg: string;
    testMsg: string;
    logs: QueryMsgWithDiffLog[];
  };

  open: boolean;
  onClose: () => void;
};
const DiffJsonView: FC<DiffJsonViewProps> = ({ data, open = false, onClose }) => {
  const { t } = useTranslation(['components']);
  const { theme } = useUserProfile();
  if (!data) {
    return <div></div>;
  }
  const baseMsg = {
    json: JSON.parse(data?.baseMsg),
    text: undefined,
  };

  const testMsg = {
    json: JSON.parse(data?.testMsg),
    text: undefined,
  };
  const msgWithDiff = data;
  const allDiffByType = genAllDiffByType(msgWithDiff.logs);
  const onClassName = (path: string[]) => {
    if (
      allDiffByType.diff012.map((item: any) => JSON.stringify(item)).includes(JSON.stringify(path))
    ) {
      return 'different_element_012';
    }
    if (
      allDiffByType.diff3.map((item: any) => JSON.stringify(item)).includes(JSON.stringify(path))
    ) {
      return 'different_element';
    }
  };
  return (
    <Drawer width={'75%'} footer={false} open={open} style={{ top: 0 }} onClose={onClose}>
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
            content={testMsg}
            readOnly
            mainMenuBar={false}
            onClassName={onClassName}
            allDiffByType={allDiffByType}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default DiffJsonView;
