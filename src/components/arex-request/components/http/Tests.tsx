import { javascript } from '@codemirror/lang-javascript';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Typography } from 'antd';
import { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
const { Text } = Typography;
import { useCodeMirror } from '../../helpers/editor/codemirror';
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
    border-left: 1px solid #eee;
    padding-left: 20px;
  }
`;

const HttpTests = () => {
  const { store, dispatch } = useContext(HttpContext);
  const { t } = useTranslation();
  const codeSnippet = [
    {
      name: 'Response: Status code is 200',
      text: `
// Check status code is 200
arex.test("Status code is 200", ()=> {
    arex.expect(arex.response.status).toBe(200);
});
`,
    },
    {
      name: 'Response: Assert property from body',
      text: `
// Check JSON response property
arex.test("Check JSON response property", ()=> {
    arex.expect(arex.response.body.age).toBe(18);
});
`,
    },
    {
      name: 'Status code: Status code is 2xx',
      text: `
// Check status code is 2xx
arex.test("Status code is 2xx", ()=> {
    arex.expect(arex.response.status).toBeLevel2xx();
});`,
    },
    {
      name: 'Status code: Status code is 3xx',
      text: `
// Check status code is 3xx
arex.test("Status code is 3xx", ()=> {
    arex.expect(arex.response.status).toBeLevel3xx();
});`,
    },
    {
      name: 'Status code: Status code is 4xx',
      text: `
// Check status code is 4xx
arex.test("Status code is 4xx", ()=> {
    arex.expect(arex.response.status).toBeLevel4xx();
});`,
    },
    {
      name: 'Status code: Status code is 5xx',
      text: `
// Check status code is 5xx
arex.test("Status code is 5xx", ()=> {
    arex.expect(arex.response.status).toBeLevel5xx();
});`,
    },
  ];

  const codeCm = useRef(null);

  useCodeMirror({
    container: codeCm.current,
    value: store.request.testScript,
    height: '100%',
    extensions: [javascript()],
    theme: store.theme,
    onChange: (value: string) => {
      dispatch((state) => {
        state.request.testScript = value;
      });
    },
  });

  const addTest = (text: string) => {
    dispatch((state) => {
      state.request.testScript = state.request.testScript += text;
    });
  };

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
        <div ref={codeCm} style={{ width: '65%' }} />
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
            Test scripts are written in JavaScript, and are run after the
            response is received.
          </Text>
          <div>
            <a
              type="text"
              onClick={() =>
                window.open('https://docs.hoppscotch.io/features/tests')
              }
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
              <ThemeColorPrimaryButton
                type="text"
                key={i}
                onClick={() => addTest(e.text)}
              >
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
