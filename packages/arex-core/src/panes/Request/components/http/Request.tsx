import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Dropdown, MenuProps, message, Select } from 'antd';
import { FC, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { HttpContext, HttpProps } from '../../index';
import SmartEnvInput from '../smart/EnvInput';
const HeaderWrapper = styled.div`
  display: flex;
  .ant-select-selector {
    border-radius: 0;
  }
`;

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
interface HttpRequestProps {
  onSend: HttpProps['onSend'];
  onSave: HttpProps['onSave'];
  breadcrumb: any;
}
const HttpRequest: FC<HttpRequestProps> = ({ onSend, onSave, breadcrumb }) => {
  const { store, dispatch } = useContext(HttpContext);

  const { t } = useTranslation();
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    message.info('Click on menu item.');
  };

  const items: MenuProps['items'] = [
    {
      label: '1st menu item',
      key: '1',
      icon: <UserOutlined />,
    },
    {
      label: '2nd menu item',
      key: '2',
      icon: <UserOutlined />,
    },
    {
      label: '3rd menu item',
      key: '3',
      icon: <UserOutlined />,
    },
  ];

  const handleRequest = ({ type }: any) => {
    const urlPretreatment = (url: string) => {
      const editorValueMatch = url.match(/\{\{(.+?)\}\}/g) || [''];
      for (let j = 0; j < editorValueMatch.length; j++) {
        let replaceVar = editorValueMatch[j];
        const env = store.environment?.variables || [];
        for (let i = 0; i < env.length; i++) {
          if (env[i].key === editorValueMatch[j].replace('{{', '').replace('}}', '')) {
            replaceVar = env[i].value;
            url = url.replace(editorValueMatch[j], replaceVar);
          }
        }
      }
      return url;
    };
    dispatch((state) => {
      state.response = {
        type: 'loading',
      };
    });
    // *** 参与校验分两种 1.重提醒，弹窗提示 2.静默处理，例如空值
    onSend({
      ...store.request,
      headers: store.request.headers.filter((f) => f.key !== '' && f.value !== ''),
      params: store.request.params.filter((f) => f.key !== '' && f.value !== ''),
      endpoint: urlPretreatment(store.request.endpoint),
    }).then((responseAndTestResult) => {
      dispatch((state) => {
        if (responseAndTestResult.response.type === 'success') {
          state.response = responseAndTestResult.response;
          state.testResult = responseAndTestResult.testResult;

          // @ts-ignore
          state.ewaiResult = responseAndTestResult.ewaiResult;
        }
      });
    });
  };

  const mockEnvironment = useMemo(() => {
    return store.environment;
  }, [store.environment]);
  return (
    <div
      css={css`
        padding: 0 12px;
        //padding-top: 0;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        `}
      >
        {breadcrumb}
        <div>
          <Button
            disabled={store.edited}
            onClick={() => {
              onSave(store.request);
            }}
          >
            {t('action.save')}
          </Button>
        </div>
      </div>
      <HeaderWrapper>
        <Select
          css={css`
            width: 120px;
            transform: translateX(1px);
          `}
          value={store.request.method}
          options={methods.map((i) => ({ value: i, lable: i }))}
          onChange={(value) => {
            dispatch((state) => {
              state.request.method = value;
            });
          }}
        />
        <SmartEnvInput
          value={store.request.endpoint}
          onChange={(v) => {
            // console.log('http://127.0.0.1:5173/arex-request/');
            dispatch((state) => {
              state.request.endpoint = v;
            });
          }}
        ></SmartEnvInput>

        {/*<UbButton>ssss</UbButton>*/}

        <div
          css={css`
            margin: 0 0px 0 10px;
          `}
        >
          <Dropdown.Button
            onClick={() => handleRequest({ type: null })}
            type='primary'
            menu={{
              onClick: handleMenuClick,
              items: items,
            }}
            icon={<DownOutlined />}
          >
            {t('action.send')}
          </Dropdown.Button>
        </div>
      </HeaderWrapper>
    </div>
  );
};

export default HttpRequest;
