import { DeleteOutlined, PicRightOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';
import styled from '@emotion/styled';
import CodeMirror from '@uiw/react-codemirror';
import { Button, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useStore } from '../../store';

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

export const ResponseTestWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  & > div:last-of-type {
    width: 35%;
    text-align: left;
    color: ${(props) => props.theme.color.text.primary};
    border-left: 1px solid #eee;
    padding-left: 20px;
    & > span:first-of-type {
      color: ${(props) => props.theme.color.text.secondary};
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

export type ResponseTestProps = {
  OldTestVal: string;
  getTestVal: (p: any) => void;
};

const ResponseTest = ({ getTestVal, OldTestVal }: ResponseTestProps) => {
  const { t: t_common } = useTranslation('common');
  const { t: t_components } = useTranslation('components');

  const {
    userInfo: {
      profile: { theme },
    },
    themeClassify,
  } = useStore();

  const [TestVal, setTestVal] = useState<string>('');
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
  ];
  const addTest = (text: string) => {
    getTestVal(TestVal + text);
    setTestVal(TestVal + text);
  };
  const CodeMirrorChange = (instance: string) => {
    getTestVal(instance);
    setTestVal(instance);
  };
  const feedLine = () => {
    setIsLineWrapping(!isLineWrapping);
  };

  useEffect(() => {
    setTestVal(OldTestVal);
  }, [OldTestVal]);

  return (
    <>
      <ResponseTestHeader>
        <span>{t_components('http.javaScriptCode')}</span>
        <div>
          <Tooltip title={t_common('help')}>
            <Button disabled type='text' icon={<QuestionCircleOutlined />} />
          </Tooltip>
          <Tooltip title={t_common('lineFeed')}>
            <Button type='text' icon={<PicRightOutlined />} onClick={feedLine} />
          </Tooltip>
          <Tooltip title={t_common('clearAll')}>
            <Button type='text' icon={<DeleteOutlined />} onClick={() => setTestVal('')} />
          </Tooltip>
        </div>
      </ResponseTestHeader>
      <ResponseTestWrapper>
        <CodeMirror
          value={TestVal}
          height='auto'
          minHeight='300px'
          onChange={(e: string) => CodeMirrorChange(e)}
          extensions={isLineWrapping ? [javascript()] : [EditorView.lineWrapping, javascript()]}
          theme={themeClassify}
          style={{ width: '65%' }}
          // options = {{
          //   lineWrapping:true,
          // }}
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
            <Button type='text' key={i} onClick={() => addTest(e.text)}>
              {e.name}
            </Button>
          ))}
        </div>
      </ResponseTestWrapper>
    </>
  );
};

export default ResponseTest;
