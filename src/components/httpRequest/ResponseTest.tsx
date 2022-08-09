import { DeleteOutlined, QuestionCircleOutlined, PicRightOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, Tooltip } from 'antd';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import CodeMirror from '@uiw/react-codemirror';
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
    color: #9d9d9d;
    border-left: 1px solid #eee;
    padding-left: 20px;
    & > span:first-of-type {
      color: #737373;
    }
    & > div:nth-of-type(2) {
      margin-top: 15px;
    }
  }
`;

const ResponseTest: FC<{}> = ({ getTestVal }: any) => {
  const { t: t_common } = useTranslation('common');
  const { t: t_components } = useTranslation('components');
  const [TestVal, setTestval] = useState<string>('');
  const { theme, extensionInstalled } = useStore();
  const addTest = () => {
    const test = `
// Check status code is 200
pw.test("Status code is 200", ()=> {
    pw.expect(pw.response.status).toBe(200);
});
    `;
    getTestVal(TestVal + test);
    setTestval(TestVal + test);
  };
  const CodeMirrorChange = (instance: string) => {
    getTestVal(instance);
    setTestval(instance);
  };
  return (
    <>
      <ResponseTestHeader>
        <span>{t_components('JavaScript代码')}</span>
        <div>
          <Tooltip title={t_common('help')}>
            <Button type='text' icon={<QuestionCircleOutlined />} />
          </Tooltip>
          <Tooltip title={t_common('lineFeed')}>
            <Button
              type='text'
              icon={<PicRightOutlined />}
              onClick={() => {
                console.log(TestVal);
              }}
            />
          </Tooltip>
          <Tooltip title={t_common('clearAll')}>
            <Button type='text' icon={<DeleteOutlined />} onClick={() => setTestval('')} />
          </Tooltip>
        </div>
      </ResponseTestHeader>
      <ResponseTestWrapper>
        <CodeMirror
          value={TestVal}
          height='auto'
          minHeight='300px'
          onChange={(e: string) => CodeMirrorChange(e)}
          extensions={[javascript()]}
          theme={theme}
          style={{ width: '65%' }}
        />
        <div>
          <div>测试脚本使用JavaScript编写,并再受到响应后执行</div>
          <span>阅读文档</span>
          <div>代码片段</div>
          <div onClick={addTest}>Response: Status code is 200</div>
        </div>
      </ResponseTestWrapper>
    </>
  );
};

export default ResponseTest;
