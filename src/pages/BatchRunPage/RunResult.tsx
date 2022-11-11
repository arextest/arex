import { css } from '@emotion/react';
import { Empty, Spin, Tag } from 'antd';
import { GlobalContext, TestResult } from 'arex-request';
import { FC, useContext, useMemo } from 'react';

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
function NewTestResult({ testResult }) {
  return (
    <div
      css={css`
        margin-bottom: 12px;
      `}
    >
      {testResult.children.map((i) => {
        const isPass = i.expectResults.filter((i) => i.status === 'fail').length === 0 ? 0 : 1;
        const r = [
          {
            bgc: '#0cbb52',
            text: 'Pass',
          },
          {
            bgc: '#eb2013',
            text: 'Fail',
          },
        ];
        return (
          <div
            css={css`
              display: flex;
              align-items: center;
            `}
          >
            <div
              css={css`
                height: 16px;
                width: 3px;
                background-color: ${r[isPass].bgc};
              `}
            ></div>
            <span
              css={css`
                margin-left: 14px;
                margin-right: 14px;
              `}
            >
              {r[isPass].text}
            </span>
            <span>{i.descriptor}</span>
            {i.expectResults.map((e) => {
              return (
                <span
                  css={css`
                    margin-left: 8px;
                  `}
                >
                  ｜{e.message}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
const RunResult: FC<RunResultProps> = ({ result, loading }) => {
  const { store: globalStore } = useContext(GlobalContext);
  const realResult = useMemo(() => {
    return result.filter((i) => i.children.filter((f) => f.testResult).length > 0);
  }, [result]);
  const urlPretreatment = (url: string) => {
    // 正则匹配{{}}
    const editorValueMatch = url.match(/\{\{(.+?)\}\}/g) || [''];
    let replaceVar = editorValueMatch[0];
    const env = globalStore.environment?.keyValues || [];
    for (let i = 0; i < env.length; i++) {
      if (env[i].key === editorValueMatch[0].replace('{{', '').replace('}}', '')) {
        replaceVar = env[i].value;
      }
    }

    return url.replace(editorValueMatch[0], replaceVar);
  };
  return (
    <Spin spinning={loading}>
      {realResult.length > 0 ? (
        realResult.map((resultItem) => (
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
                {urlPretreatment(resultItem?.request.address?.endpoint)}
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
                          <NewTestResult testResult={testResultItem.testResult}></NewTestResult>
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
