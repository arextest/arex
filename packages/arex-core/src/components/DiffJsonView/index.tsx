import { CompareConfigType, JSONPath } from '@arextest/vanilla-jsoneditor';
import { css } from '@emotion/react';
import { App, Modal, theme } from 'antd';
import React, { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useArexCoreConfig } from '../../hooks';
import { base64Decode } from '../../utils';
import DiffJsonTooltip from './DiffJsonTooltip';
import { genAllDiffByType, getJsonValueByPath, LogEntity } from './helper';
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
  nodeDecode?: boolean;
  height?: string | number;
  hiddenTooltip?: boolean;
  diffJson?: { left: string; right: string };
  diffPath?: LogEntity[];
  remark?: [string, string];
  onIgnoreKey?: PathHandler;
  onIgnoreKeyMono?: PathHandler;
  onSortKey?: PathHandler;
  onReferenceKey?: PathHandler;
  onCompressKey?: PathHandler;
  onDiffMatch?: PathHandler;
};

const { useToken } = theme;
const DiffJsonView: FC<DiffJsonViewProps> = ({
  readOnly,
  encrypted,
  nodeDecode,
  diffJson,
  diffPath,
  hiddenTooltip,
  height,
  remark,
  onIgnoreKey,
  onIgnoreKeyMono,
  onSortKey,
  onReferenceKey,
  onCompressKey,
  onDiffMatch,
}) => {
  const { message } = App.useApp();
  const { t } = useTranslation();
  const { theme, language } = useArexCoreConfig();
  const [open, setOpen] = useState(false);
  const [decodeData, setDecodeData] = useState<string>();

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

  const nodeDecodeHandler = useCallback(
    async (path: JSONPath, targetEditor: TargetEditor) => {
      let value = getJsonValueByPath(diffJson![targetEditor], path);

      try {
        value = base64Decode(value);
      } catch (e) {
        console.error(e);
        message.error(t('failedToDecodeBase64'));
        return;
      }
      setOpen(true);
      setDecodeData(value);
    },
    [diffJson, t],
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
            onIgnoreKeyMono={
              onIgnoreKeyMono &&
              ((path) => rightClickHandler(onIgnoreKeyMono, path, TargetEditor.left))
            }
            onSortKey={
              onSortKey && ((path) => rightClickHandler(onSortKey, path, TargetEditor.left))
            }
            onReferenceKey={
              onReferenceKey &&
              ((path) => rightClickHandler(onReferenceKey, path, TargetEditor.left))
            }
            onCompressKey={
              onCompressKey && ((path) => rightClickHandler(onCompressKey, path, TargetEditor.left))
            }
            onDiffMatch={
              onDiffMatch && ((path) => rightClickHandler(onDiffMatch, path, TargetEditor.left))
            }
            onNodeDecode={
              nodeDecode ? (path) => nodeDecodeHandler(path, TargetEditor.left) : undefined
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
            onIgnoreKeyMono={
              onIgnoreKeyMono &&
              ((path) => rightClickHandler(onIgnoreKeyMono, path, TargetEditor.right))
            }
            onSortKey={
              onSortKey && ((path) => rightClickHandler(onSortKey, path, TargetEditor.right))
            }
            onReferenceKey={
              onReferenceKey &&
              ((path) => rightClickHandler(onReferenceKey, path, TargetEditor.right))
            }
            onCompressKey={
              onCompressKey &&
              ((path) => rightClickHandler(onCompressKey, path, TargetEditor.right))
            }
            onDiffMatch={
              onDiffMatch && ((path) => rightClickHandler(onDiffMatch, path, TargetEditor.right))
            }
            onNodeDecode={
              nodeDecode ? (path) => nodeDecodeHandler(path, TargetEditor.right) : undefined
            }
          />
        </div>

        <Modal
          destroyOnClose
          title={t('base64DecodeContent')}
          open={open}
          footer={false}
          getContainer={false}
          onCancel={() => setOpen(false)}
        >
          <VanillaJSONEditor
            readOnly
            encrypted={false}
            height={height}
            language={language}
            content={{
              text: String(decodeData), // stringify falsy value
              json: undefined,
            }}
            mainMenuBar={false}
          />
        </Modal>
      </div>
    </>
  );
};

export default DiffJsonView;
