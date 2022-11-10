import { css } from '@emotion/react';
import { Empty, Spin, Tag } from 'antd';
import { TestResult } from 'arex-request';
import { FC, useMemo } from 'react';

// import { TestResult } from '../../components/ArexRequestComponent/lib';
interface RunResultProps {
  result: {
    title: string;
    method: string;
    endpoint: string;
    children: {
      testResult: any;
    }[];
  }[];
}
const RunResult: FC<RunResultProps> = ({ result, loading }) => {
  const ssss = useMemo(() => {
    return result.filter((i) => i.children.filter((f) => f.testResult).length > 0);
  }, [result]);
  return (
    <Spin spinning={loading}>
      {ssss.length > 0 ? (
        ssss.map((resultItem) => (
          <div>
            <div
              css={css`
                display: flex;
                align-items: center;
                margin-bottom: 14px;
                font-weight: bolder;
              `}
            >
              <div
                css={css`
                  margin-right: 14px;
                  font-size: 14px;
                  font-weight: bolder;
                `}
              >
                {resultItem?.request.address?.method}
              </div>
              <div
                css={css`
                  margin-right: 14px;
                  font-size: 14px;
                  font-weight: bolder;
                `}
              >
                {resultItem?.fileNode.title}
              </div>
              <div
                css={css`
                  color: grey;
                  font-size: 12px;
                `}
              >
                {resultItem?.request.address?.endpoint}
              </div>
            </div>

            <div
              css={css`
                padding-left: 14px;
                margin-bottom: 28px;
              `}
            >
              {resultItem.children
                .filter((i) => i.testResult)
                .map((testResultItem) => {
                  return (
                    <div>
                      <div
                        css={css`
                          margin-bottom: 14px;
                        `}
                      >
                        <Tag>CASE</Tag>
                        <span>{testResultItem?.fileNode?.title}</span>
                      </div>
                      {testResultItem.testResult ? (
                        <div>
                          <TestResult testResult={testResultItem.testResult}></TestResult>
                        </div>
                      ) : (
                        <div
                          css={css`
                            color: red;
                          `}
                        >
                          error
                        </div>
                      )}

                      {testResultItem.testResult.children.length === 0 ? (
                        <div>No test results.</div>
                      ) : null}
                    </div>
                  );
                })}
            </div>
          </div>
        ))
      ) : (
        <Empty />
      )}
    </Spin>
  );
};

export default RunResult;
