import { CompareConfigType, JSONPath, NodeDecodeType } from '@arextest/vanilla-jsoneditor';
import { css } from '@emotion/react';
import { App, message, theme } from 'antd';
import React, { FC, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';

import { useArexCoreConfig } from '../../hooks';
import {
  base64Decode,
  tryParseJsonString,
  tryPrettierJsonString,
  tryStringifyJson,
  zstdDecode,
} from '../../utils';
import DiffJsonTooltip from './DiffJsonTooltip';
import { genAllDiffByType, getJsonValueByPath, LogEntity, setJsonValueByPath } from './helper';
import VanillaJSONEditor from './JSONEditor';

export enum TargetEditor {
  'left' = 'left',
  'right' = 'right',
}

export type PathHandler<P> = (params: {
  type?: P;
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
  onIgnoreKey?: PathHandler<CompareConfigType>;
  onSortKey?: PathHandler<CompareConfigType>;
  onReferenceKey?: PathHandler<CompareConfigType>;
  onCompressKey?: PathHandler<CompareConfigType>;
  onDiffMatch?: PathHandler<CompareConfigType>;
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
  onSortKey,
  onReferenceKey,
  onCompressKey,
  onDiffMatch,
}) => {
  const { message } = App.useApp();
  const { t } = useTranslation();
  const { theme, language } = useArexCoreConfig();
  const allLeftDiffByType = genAllDiffByType(TargetEditor.left, diffPath);
  const allRightDiffByType = genAllDiffByType(TargetEditor.right, diffPath);

  // for store decode value
  const [json, setJson] = useImmer(diffJson);
  useEffect(() => {
    setJson(diffJson);
  }, [diffJson]);

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
    (
      fn: PathHandler<CompareConfigType>,
      path: string[],
      targetEditor: TargetEditor,
      type?: CompareConfigType,
    ) => {
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
    async (path: JSONPath, targetEditor: TargetEditor, type?: NodeDecodeType) => {
      let value = getJsonValueByPath(diffJson![targetEditor], path);

      try {
        if (type === 'zstd') {
          value = await zstdDecode(value);
        } else if (type === 'base64') {
          value = base64Decode(value);
        }
        value = tryParseJsonString(value);
      } catch (e) {
        message.error('fail to decode');
      }

      setJson((state) => {
        const newJson = tryStringifyJson(
          setJsonValueByPath(state![targetEditor], path, value),
          undefined,
          true,
        );
        newJson && (state![targetEditor] = newJson);
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
              text: String(json?.left), // stringify falsy value
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
            onNodeDecode={
              nodeDecode
                ? (path, type) => nodeDecodeHandler(path, TargetEditor.left, type)
                : undefined
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
              text: String(json?.right), // stringify falsy value
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
            onNodeDecode={
              nodeDecode
                ? (path, type) => nodeDecodeHandler(path, TargetEditor.right, type)
                : undefined
            }
          />
        </div>
      </div>
    </>
  );
};

export default DiffJsonView;
