import { javascript } from '@codemirror/lang-javascript';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Typography } from 'antd';
import { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
const { Text } = Typography;
import { useCodeMirror } from '../../helpers/editor/codemirror';

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

const SingleScriptInput = ({ value, onChange, codeSnippet, theme }) => {
  const { t } = useTranslation();

  const codeCm = useRef(null);

  useCodeMirror({
    container: codeCm.current,
    value: value,
    height: '100%',
    extensions: [javascript()],
    theme: theme,
    onChange: (v: string) => {
      onChange(v);
    },
  });

  const addTest = (text: string) => {
    onChange((value += text));
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
            Test scripts are written in JavaScript, and are run after the response is received.
          </Text>
          <div>
            <a type='text' onClick={() => window.open('https://docs.hoppscotch.io/features/tests')}>
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

export default SingleScriptInput;
