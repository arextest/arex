import { theme, Typography } from 'antd';
import { diff_match_patch } from 'diff-match-patch';
import React, { FC, useCallback } from 'react';

export type DiffMatchProps = { text1?: string | number | null; text2?: string | number | null };

const DiffMatch: FC<DiffMatchProps> = (props) => {
  const { token } = theme.useToken();
  const Diff = new diff_match_patch();
  const diffs = Diff.diff_main(props.text1?.toString() || '', props.text2?.toString() || '');
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

  return (
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
