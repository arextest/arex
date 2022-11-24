import { javascript } from '@codemirror/lang-javascript';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button } from 'antd';
import { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useDarkMode from 'use-dark-style';

import { useCodeMirror } from '../../helpers/editor/codemirror';
import { GlobalContext, HttpContext } from '../../index';

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
  color: ${(props) => props.theme.color.primary} !important;
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
    & > span:first-of-type {
    }
    & > div:nth-of-type(2) {
      margin-top: 15px;
      margin-bottom: 10px;
    }
    & > span:nth-of-type(n + 2) {
      display: inline-block;
      color: #10b981;
      cursor: pointer;
      font-weight: bold;
      margin-left: 18px;
      margin-top: 10px;
      &:hover {
        color: #059669;
        transform: translateX(6px);
        transition: all 0.2s ease 0s;
      }
    }
  }
`;

const HttpTests = () => {
  const darkMode = useDarkMode();
  const { store, dispatch } = useContext(HttpContext);
  const { t } = useTranslation();
  const [isLineWrapping, setIsLineWrapping] = useState<boolean>(true);
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
    theme: darkMode.value ? 'dark' : 'light',
    onChange: (val) => {
      dispatch({
        type: 'request.testScript',
        payload: val,
      });
    },
  });

  const addTest = (text: string) => {
    dispatch({
      type: 'request.testScript',
      payload: store.request.testScript + text,
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
        <div>
        </div>
      </ResponseTestHeader>
      <ResponseTestWrapper>
        <div
          ref={codeCm}
          style={{ width: '65%' }}
        />
        <div>
          <div>
            Test scripts are written in JavaScript, and are run after the response is received.
          </div>
          <Button
            type='text'
            onClick={() => window.open('https://docs.hoppscotch.io/features/tests')}
          >
            Read documentation
          </Button>
          <div>Snippets</div>
          {/* <div>测试脚本使用JavaScript编写,并再受到响应后执行</div>
          <span>阅读文档</span>
          <div>代码片段</div> */}
          {codeSnippet.map((e, i) => (
            <ThemeColorPrimaryButton type='text' key={i} onClick={() => addTest(e.text)}>
              {e.name}
            </ThemeColorPrimaryButton>
          ))}
        </div>
      </ResponseTestWrapper>
    </div>
  );
};

export default HttpTests;
