import { TestResult } from '../../components/ArexRequestComponent/lib';
import { css } from '@emotion/react';

function zhuanhuan() {}

const RunResult = ({ results }) => {
  return (
    <div>
      {results.map((result) => (
        <div>
          <div
            css={css`
              margin-bottom: 14px;
            `}
          >
            <span
              css={css`
                color: orange;
              `}
            >
              {result.method}
            </span>{' '}
            <span>{result.endpoint}</span>
          </div>

          <TestResult testResult={result.testResult}></TestResult>
        </div>
      ))}
    </div>
  );
};

export default RunResult;
