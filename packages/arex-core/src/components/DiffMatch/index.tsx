import { theme, Typography } from 'antd';
import { diff_match_patch } from 'diff-match-patch';
import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Label from '../Label';

type TextValue = string | number | null | undefined;
type Text = {
  type: string | null | undefined;
  value: TextValue;
};

export type DiffMatchProps =
  | { text1?: TextValue; text2?: TextValue }
  | {
      text1?: Text;
      text2?: Text;
    };

const DiffMatch: FC<DiffMatchProps> = (props) => {
  const { token } = theme.useToken();
  const { t } = useTranslation();

  const Diff = new diff_match_patch();
  const diffs = Diff.diff_main(
    (typeof props.text1 === 'object' ? props.text1?.value?.toString() : props.text1?.toString()) ||
      '',
    (typeof props.text2 === 'object' ? props.text2?.value?.toString() : props.text2?.toString()) ||
      '',
  );
  Diff.diff_cleanupSemantic(diffs);

  const getBackgroundColor = useCallback(
    (type: number) =>
      ({ '-1': token.colorErrorBorder, '0': undefined, '1': token.colorSuccessBorder }[
        type.toString()
      ]),
    [token],
  );

  const getTextDecoration = (type: number) =>
    ({ '-1': 'line-through', '0': undefined, '1': 'underline' }[type.toString()]);

  const isShallowEquality =
    typeof props.text1 === 'object' &&
    typeof props.text2 === 'object' &&
    props.text1?.value === props.text2?.value &&
    props.text1?.type !== props.text2?.type;

  return isShallowEquality ? (
    <>
      <div>{(props.text1 as Text).value}</div>

      <div style={{ display: 'flex' }}>
        <div>
          <Label type='secondary'>{t('recordDataType')} </Label>
          <Typography.Text strong type='secondary'>
            {(props.text1 as Text).type}
          </Typography.Text>
        </div>

        <Typography.Text type='secondary' style={{ margin: '0 8px' }}>
          |
        </Typography.Text>

        <div>
          <Label type='secondary'>{t('replayDataType')}</Label>
          <Typography.Text strong type='secondary'>
            {(props.text2 as Text).type}
          </Typography.Text>
        </div>
      </div>
    </>
  ) : (
    <>
      {diffs.map((diff, index) => (
        <Typography.Text
          key={index}
          style={{
            backgroundColor: getBackgroundColor(diff[0]),
            textDecoration: getTextDecoration(diff[0]),
          }}
        >
          {diff[1]}
        </Typography.Text>
      ))}
    </>
  );
};

export default DiffMatch;
