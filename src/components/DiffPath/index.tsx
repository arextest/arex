import { css } from '@emotion/react';
import { Allotment } from 'allotment';
import React, { FC, useMemo } from 'react';

import { CompareResultDetail } from '../../services/Replay.type';
import { EmptyWrapper } from '../styledComponents';
import DiffPathViewer from './DiffPathViewer';
import useDiffPathTooltip from './useDiffPathTooltip';

export interface DiffPathProps {
  appId: string;
  operationId: string;
  loading?: boolean;
  defaultOnlyFailed?: boolean;
  data: CompareResultDetail[];
}

const DiffPath: FC<DiffPathProps> = (props) => {
  const { defaultOnlyFailed = true } = props;
  const { Tooltip, onlyFailed } = useDiffPathTooltip({
    defaultOnlyFailed,
  });

  const diffListFiltered = useMemo(
    () => (onlyFailed ? props.data.filter((item) => item.diffResultCode > 0) : props.data),
    [props.data, onlyFailed],
  );

  return (
    <>
      <Tooltip count={diffListFiltered.length} />

      <EmptyWrapper loading={props.loading} empty={!diffListFiltered.length}>
        <Allotment
          vertical
          minSize={48}
          css={css`
            height: ${diffListFiltered.length * 400 || 200}px;
          `}
        >
          {diffListFiltered.map((data) => (
            <Allotment.Pane
              key={data?.id + onlyFailed}
              css={css`
                height: 100%;
              `}
            >
              <DiffPathViewer
                appId={props.appId}
                operationId={props.operationId}
                height={'100%'}
                data={data as CompareResultDetail}
              />
            </Allotment.Pane>
          ))}
        </Allotment>
      </EmptyWrapper>
    </>
  );
};

export default DiffPath;
