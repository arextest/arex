import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Typography } from 'antd';
import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
const { Text } = Typography;
import { useMonaco } from '../../../../hooks';
import { HttpContext } from '../../index';

export const ResponseTestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  & > span:first-of-type {
    font-size: 13px;
    line-height: 32px;
    font-weight: 500;
    color: #9d9d9d;
  }
`;

const ThemeColorPrimaryButton = styled(Button)`
  color: ${(props) => props.theme.colorPrimary} !important;
`;

export const ResponseTestWrapper = styled.div`
  overflow-y: auto;
  display: flex;
  justify-content: space-between;
  flex: 1;
  & > div:last-of-type {
    width: 35%;
    text-align: left;
    //border-left: 1px solid #eee;
    padding-left: 20px;
  }
`;

const HttpTests = () => {
  const { store, dispatch } = useContext(HttpContext);
  const { t } = useTranslation();
  const theme = useTheme();
  const codeSnippet = [
    {
      name: 'Response: Status code is 200',
      text: `
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
`,
    },
    {
      name: 'Response: Assert property from body',
      text: `
pm.test("Your test name", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.value).to.eql(100);
});
`,
    },
  ];

  const addTest = (text: string) => {
    dispatch((state) => {
      state.request.testScript = state.request.testScript += text;
    });
  };

  const testScriptEditor = useRef(null);
  useMonaco(testScriptEditor, store.request.testScript, {
    extendedEditorConfig: {
      lineWrapping: true,
      mode: 'javascript',
      placeholder: t('request.raw_body').toString(),
      theme: store.theme,
    },
    environmentHighlights: true,
    onChange: (value: string) => {
      dispatch((state) => {
        state.request.testScript = value;
      });
    },
  });

  return (
    <div
      css={css`
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <ResponseTestHeader>
        <span>{t('preRequest.javascript_code')}</span>
        <div></div>
      </ResponseTestHeader>
      <ResponseTestWrapper>
        <div
          css={css`
            min-width: 0;
            flex: 1;
            //width: 100%;
          `}
        >
          <div
            css={css`
              height: 100%;
            `}
            ref={testScriptEditor}
          ></div>
        </div>

        <div
          css={css`
            display: flex;
            flex-direction: column;
          `}
        >
          <Text
            type={'secondary'}
            css={css`
              margin-bottom: 4px;
            `}
          >
            Test scripts are written in JavaScript, and are run after the response is received.
          </Text>
          <div>
            <a
              css={css`
                color: ${theme.colorPrimary};
              `}
              type='text'
              onClick={() => window.open('https://docs.hoppscotch.io/features/tests')}
            >
              Read documentation
            </a>
          </div>
          <Text
            type={'secondary'}
            css={css`
              padding: 16px 0;
            `}
          >
            Snippets
          </Text>
          <div
            css={css`
              overflow: auto;
              flex: 1;
            `}
          >
            {codeSnippet.map((e, i) => (
              <ThemeColorPrimaryButton type='text' key={i} onClick={() => addTest(e.text)}>
                {e.name}
              </ThemeColorPrimaryButton>
            ))}
          </div>
        </div>
      </ResponseTestWrapper>
    </div>
  );
};

export default HttpTests;
