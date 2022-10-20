import { EditOutlined } from '@ant-design/icons';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import CodeMirror from '@uiw/react-codemirror';
import { useRequest } from 'ahooks';
import { Allotment } from 'allotment';
import {
  Badge,
  Breadcrumb,
  Button,
  Divider,
  Empty,
  Input,
  message,
  Select,
  Spin,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useImmer } from 'use-immer';

import { AnimateAutoHeight } from '../components';
import {
  FormHeader,
  FormHeaderWrapper,
  FormTable,
  Response,
  ResponseCompare,
  ResponseTest,
  SaveRequestButton,
  useColumns,
} from '../components/httpRequest';
import Mock from '../components/httpRequest/Mock';
import SmartEnvInput from '../components/smart/EnvInput';
import { Label, SpaceBetweenWrapper } from '../components/styledComponents';
import { ContentTypeEnum, MethodEnum, METHODS, NodeType } from '../constant';
import { treeFindPath } from '../helpers/collection/util';
import { readableBytes } from '../helpers/http/responseMeta';
import AgentAxios from '../helpers/request';
import { runTestScript } from '../helpers/sandbox';
import {
  generateGlobalPaneId,
  parseGlobalPaneId,
  tryParseJsonString,
  tryPrettierJsonString,
} from '../helpers/utils';
import { MenuTypeEnum } from '../menus';
import { CollectionService } from '../services/CollectionService';
import { FileSystemService } from '../services/FileSystem.service';
import { Page, useStore } from '../store';
import { PageFC, PageTypeEnum } from './index';

const { TabPane } = Tabs;

export enum HttpRequestMode {
  Normal = 'normal',
  Compare = 'compare',
}

export type KeyValueType = {
  key: string;
  value: string;
  active?: boolean;
};

export type ParamsObject = { [key: string]: string };

const RequestTypeOptions = METHODS.map((method) => ({
  label: method,
  value: method,
}));

const HeaderWrapper = styled.div`
  display: flex;

  .ant-select > .ant-select-selector {
    width: 120px;
    left: 1px;
    border-radius: 2px 0 0 2px;
    .ant-select-selection-item {
      font-weight: 500;
    }
    :hover {
      z-index: 1000;
    }
  }
  .ant-input {
    border-radius: 0 2px 2px 0;
  }
  .ant-btn-group,
  .ant-btn {
    margin-left: 16px;
  }
`;

const CountTag = styled(Tag)`
  border-radius: 8px;
  padding: 0 6px;
  margin-left: 4px;
`;

const ResponseWrapper = styled.div`
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BreadcrumbHeader = styled.div`
  cursor: pointer;
  display: flex;
  .tool {
    margin-left: 8px;
    visibility: hidden;
  }
  &:hover {
    .tool {
      visibility: unset;
    }
  }
`;

// 注
// mode：有两种模式，normal、compare
// id：request的id，组件加载时拉一次数据
// isNew：是否为新增的request
const HttpRequest: PageFC = (props) => {
  const {
    userInfo: { email: userName },
    themeClassify,
    collectionTreeData,
    extensionInstalled,
    setPages,
    currentEnvironment,
  } = useStore();
  const { t: t_common } = useTranslation('common');
  const { t: t_components } = useTranslation('components');
  const _useParams = useParams();
  const [renameKey, setRenameKey] = useState('');
  const [renameValue, setRenameValue] = useState('');
  const [mode, setMode] = useState(HttpRequestMode.Normal);
  const id = useMemo(() => parseGlobalPaneId(props.page.paneId)['rawId'], [props.page.paneId]);
  // 如果是case(2)类型的话，就一定有一个父节点，类型也一定是request(1)
  const nodeInfoInCollectionTreeData = useMemo(() => {
    const paths = treeFindPath(collectionTreeData, (node) => node.key === id);

    return {
      self: paths[paths.length - 1],
      parent: paths[paths.length - 2],
      raw: paths,
    };
  }, [collectionTreeData, id]);
  const [method, setMethod] = useState<typeof METHODS[number]>(MethodEnum.GET);

  const [url, setUrl] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [testUrl, setTestUrl] = useState('');
  const [sent, setSent] = useState(false);
  const [response, setResponse] = useState<any>(); // 响应完整数据
  const [responseMeta, setResponseMeta] = useState<any>({ time: 0, size: '' }); // 响应的其他信息
  const [baseResponse, setBaseResponse] = useState<any>(); // base响应完整数据
  const [testResponse, setTestResponse] = useState<any>(); // test响应完整数据
  const [requestParams, setRequestParams] = useImmer<KeyValueType[]>([
    { key: '', value: '', active: true },
  ]);
  const [isTestResult, setIsTestResult] = useState(true);
  const [recordId, setRecordId] = useState('');
  useEffect(() => {
    handleUpdateUrl();
    response &&
      runTestScript(TestVal, {
        status: response.status,
        body: response.data,
        headers: response.headers,
      })
        .then((res: any) => {
          setTestResult(res.children);
          setIsTestResult(true);
        })
        .catch((e) => {
          setIsTestResult(false);
        });
  }, [response]);

  const params = useMemo(
    () =>
      requestParams.reduce<ParamsObject>((acc, { key, value, active }) => {
        if (key && active) {
          acc[key] = value;
        }
        return acc;
      }, {}),
    [requestParams],
  );
  const paramsCount = useMemo(
    () =>
      requestParams.reduce((count, param) => {
        param.key && param.active && count++;
        return count;
      }, 0),
    [requestParams],
  );
  const [requestHeaders, setRequestHeaders] = useImmer<KeyValueType[]>([
    {
      key: '',
      value: '',
      active: true,
    },
  ]);

  const headerFiltered = useMemo(
    () => requestHeaders.filter((header) => header.active),
    [requestHeaders],
  );

  const headerCount = useMemo(
    () =>
      headerFiltered.reduce((count, header) => {
        header.key && count++;
        return count;
      }, 0),
    [headerFiltered],
  );

  const headers = useMemo(
    () =>
      headerFiltered.reduce<{
        [key: string]: string | number;
      }>((acc, header) => {
        if (header.key) {
          acc[header.key] = header.value;
        }
        return acc;
      }, {}),
    [headerFiltered],
  );

  const [contentType, setContentType] = useState(ContentTypeEnum.ApplicationJson);
  const [requestBody, setRequestBody] = useState('');

  const validationRequest = (cancel: () => void) => {
    if (!url) {
      message.warn(t_components('http.urlEmpty'));
      cancel();
    } else if (!extensionInstalled) {
      message.warn(t_components('http.extensionNotInstalled'));
      cancel();
    }
  };
  const rename = () => {
    const paths = treeFindPath(collectionTreeData, (node) => node.key === id);
    CollectionService.rename({
      id: _useParams.workspaceId,
      newName: renameValue,
      path: paths.map((i: any) => i.key),
      userName,
    }).then((res) => {
      props.fetchCollectionTreeData?.(); // TODO 自定义PageProps未实现
      setRenameKey('');
    });
  };

  const {
    loading: requesting,
    run: request,
    cancel: cancelRequest,
  } = useRequest(AgentAxios, {
    manual: true,
    onBefore: (params) => {
      console.log(params);
      validationRequest(cancelRequest);
    },
    onSuccess: (res) => {
      setResponseMeta({
        time: new Date().getTime() - responseMeta.time,
        size: readableBytes(JSON.stringify(res.data).length),
      });
      setResponse(res);
      setSent(true);
    },
    onError(err) {
      if (err?.response) {
        setResponse(err?.response);
        setSent(true);
      } else {
        message.error('Failed to send, please check');
      }
    },
  });

  const {
    loading: baseRequesting,
    run: baseRequest,
    cancel: cancelBaseRequest,
  } = useRequest(AgentAxios, {
    manual: true,
    onBefore: () => {
      validationRequest(cancelBaseRequest);
    },
    onSuccess: (res) => {
      setBaseResponse(res);
      setSent(true);
    },
    onError(err) {
      if (err?.response) {
        setBaseResponse(err?.response);
        setSent(true);
      } else {
        message.error('Failed to send, please check');
      }
    },
    onFinally: () => {},
  });

  const {
    loading: testRequesting,
    run: testRequest,
    cancel: cancelTestRequest,
  } = useRequest(AgentAxios, {
    manual: true,
    onBefore: () => {
      validationRequest(cancelTestRequest);
    },
    onSuccess: (res) => {
      setTestResponse(res);
      setSent(true);
    },
    onError(err) {
      if (err?.response) {
        setTestResponse(err?.response);
        setSent(true);
      } else {
        message.error('Failed to send, please check');
      }
    },
    onFinally: () => {},
  });

  useRequest(
    () => {
      if (props.page.isNew || !nodeInfoInCollectionTreeData.self) {
        return new Promise((resolve, reject) => {
          resolve({
            body: {},
          });
        });
      }
      const { nodeType, key: id } = nodeInfoInCollectionTreeData.self;
      const { key: pid } = nodeInfoInCollectionTreeData.parent;
      if (nodeType === NodeType.interface) {
        return FileSystemService.queryInterface({ id });
      } else {
        return new Promise((resolve) => {
          FileSystemService.queryInterface({ id: pid }).then((interfaceRes) => {
            FileSystemService.queryCase({ id }).then((CaseRes) => {
              resolve({
                body: {
                  ...interfaceRes.body,
                  ...CaseRes.body,
                },
              });
            });
          });
        });
      }
    },
    {
      refreshDeps: [nodeInfoInCollectionTreeData],
      onSuccess(res: any) {
        setUrl(res.body.address?.endpoint || '');
        setMethod(res.body.address?.method || MethodEnum.GET);
        setRequestParams(res.body?.params || []);
        setRequestHeaders(res.body?.headers || []);
        setRequestBody(res.body?.body?.body || '');
        setTestUrl(res.body.testAddress?.endpoint || '');
        setBaseUrl(res.body.baseAddress?.endpoint || '');
        setTestVal(res.body.testScript || '');
        // console.log(res.body,'ressss')
        setRecordId(res.body.recordId);
      },
    },
  );

  const { run: saveInterface } = useRequest(
    (params, nodeType: NodeType) => {
      if (nodeType === NodeType.interface) {
        return FileSystemService.saveInterface(params).then(() => message.success('保存成功'));
      } else if (nodeType === NodeType.case) {
        return FileSystemService.saveCase(params).then(() => message.success('保存成功'));
      }
    },
    {
      manual: true,
    },
  );

  const handlePrettier = () => {
    const prettier = tryPrettierJsonString(requestBody, t_common('invalidJSON'));
    prettier && setRequestBody(prettier);
  };

  const urlPretreatment = (url: string) => {
    // 正则匹配{{}}
    const editorValueMatch = url.match(/\{\{(.+?)\}\}/g) || [''];
    let replaceVar = editorValueMatch[0];
    const env = currentEnvironment?.keyValues || [];
    for (let i = 0; i < env.length; i++) {
      if (env[i].key === editorValueMatch[0].replace('{{', '').replace('}}', '')) {
        replaceVar = env[i].value;
      }
    }

    return url.replace(editorValueMatch[0], replaceVar).split('?')[0];
  };
  const handleRequest = () => {
    const data: Partial<Record<'params' | 'data', object>> = {};
    if (method === MethodEnum.GET) {
      data.params = params;
    } else if (requestBody) {
      const body = tryParseJsonString(requestBody, t_common('invalidJSON'));
      body && (data.data = body);
    }
    setResponseMeta({ time: new Date().getTime() });
    request({
      url: urlPretreatment(url),
      method,
      headers,
      ...data,
    });
  };

  const handleCompareRequest = () => {
    if (!baseUrl) {
      return message.warn(t_components('http.urlEmpty'));
    }
    if (!testUrl) {
      return message.warn(t_components('http.urlEmpty'));
    }

    const data: Partial<Record<'params' | 'data', object>> = {};
    if (method === MethodEnum.GET) {
      data.params = params;
    } else if (requestBody) {
      const body = tryParseJsonString(requestBody, t_common('invalidJSON'));
      body && (data.data = body);
    }

    baseRequest({
      url: baseUrl,
      method,
      headers,
      ...data,
    });

    testRequest({
      url: testUrl,
      method,
      headers,
      ...data,
    });
  };

  const handleSave = () => {
    saveInterface(
      {
        workspaceId: _useParams.workspaceId,
        id,
        auth: null,
        body: {
          contentType,
          body: requestBody,
        },
        address: {
          endpoint: url,
          method,
        },
        baseAddress: {
          endpoint: baseUrl,
          method,
        },
        testAddress: {
          endpoint: testUrl,
          method,
        },
        headers: requestHeaders,
        params: requestParams,
        preRequestScript: null,
        testScript: TestVal,
      },
      nodeInfoInCollectionTreeData.self.nodeType,
    );
  };

  const handleInterfaceSaveAs = (page: Page) => {
    props.fetchCollectionTreeData?.(); // TODO 自定义PageProps未实现
    setPages(
      {
        // key: page.key,
        isNew: true,
        title: page.title,
        menuType: MenuTypeEnum.Collection,
        pageType: PageTypeEnum.Request,
        paneId: generateGlobalPaneId(MenuTypeEnum.Collection, PageTypeEnum.Request, page.key),
        rawId: page.key,
      },
      'push',
    );
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    const [_, queryStr] = value.split('?');
    if (queryStr) {
      const query = queryStr.split('&').map((q) => {
        const [key, value] = q.split('=');
        return { key, value, active: true };
      });
      setRequestParams(query);
    }
  };

  const handleUpdateUrl = () => {
    const invalidValues = ['', undefined];
    const query = requestParams
      .filter((param) => param.active && !invalidValues.includes(param.key))
      .reduce((pre, cur, i) => {
        pre += `${i === 0 ? '?' : '&'}${cur.key}=${cur.value}`;
        return pre;
      }, '');
    setUrl(url.split('?')[0] + query);
  };

  //Test
  const [TestVal, setTestVal] = useState<string>('');
  const [TestResult, setTestResult] = useState<[]>([]);

  const getTestVal = (e: string) => {
    setTestVal(e);
  };

  return (
    <>
      <Allotment
        vertical={true}
        css={css`
          height: 100%;
        `}
      >
        <Allotment.Pane preferredSize={400}>
          <AnimateAutoHeight>
            <SpaceBetweenWrapper>
              {nodeInfoInCollectionTreeData.raw.length > 0 ? (
                <BreadcrumbHeader>
                  {renameKey === '' ? (
                    <>
                      <Breadcrumb>
                        {nodeInfoInCollectionTreeData.raw.map((i, index) => (
                          <Breadcrumb.Item key={index}>{i.title}</Breadcrumb.Item>
                        ))}
                      </Breadcrumb>
                      <div
                        className={'tool'}
                        onClick={() => {
                          setRenameKey(id);
                          setRenameValue(nodeInfoInCollectionTreeData.self.title);
                        }}
                      >
                        <EditOutlined />
                      </div>
                    </>
                  ) : (
                    <Input
                      value={renameValue}
                      onChange={(val) => setRenameValue(val.target.value)}
                      onBlur={rename}
                      onPressEnter={rename}
                    />
                  )}
                </BreadcrumbHeader>
              ) : (
                <Breadcrumb>
                  <Breadcrumb.Item key={'new'}>New Request</Breadcrumb.Item>
                </Breadcrumb>
              )}
              <SpaceBetweenWrapper>
                {props.page.isNew ? (
                  <SaveRequestButton
                    reqParams={{
                      auth: null,
                      body: {
                        contentType,
                        body: requestBody,
                      },
                      address: {
                        endpoint: url,
                        method,
                      },
                      baseAddress: {
                        endpoint: baseUrl,
                        method,
                      },
                      testAddress: {
                        endpoint: testUrl,
                        method,
                      },
                      headers: requestHeaders,
                      params: requestParams,
                      preRequestScript: null,
                      testScript: null,
                    }}
                    collectionTreeData={collectionTreeData}
                    onSaveAs={handleInterfaceSaveAs}
                  />
                ) : (
                  <Button onClick={handleSave}>{t_common('save')}</Button>
                )}
                <Divider type={'vertical'} />
                <Select
                  options={[
                    { label: 'Normal', value: HttpRequestMode.Normal },
                    { label: 'Compare', value: HttpRequestMode.Compare },
                  ]}
                  value={mode}
                  onChange={(val) => {
                    setSent(false);
                    setMode(val);
                  }}
                />
              </SpaceBetweenWrapper>
            </SpaceBetweenWrapper>

            <Divider style={{ margin: '8px 0' }} />

            {/* 普通请求 */}
            {mode === HttpRequestMode.Normal ? (
              <SpaceBetweenWrapper>
                <Input.Group compact style={{ display: 'flex', width: 'calc(100% - 81px)' }}>
                  <Select value={method} options={RequestTypeOptions} onChange={setMethod} />
                  <SmartEnvInput value={url} onChange={(e) => handleUrlChange(e.target.value)} />
                </Input.Group>

                <Button type='primary' onClick={handleRequest}>
                  {t_common('send')}
                </Button>
              </SpaceBetweenWrapper>
            ) : (
              <div>
                {/* 对比请求 */}
                <HeaderWrapper style={{ marginTop: '10px' }}>
                  <Select value={method} options={RequestTypeOptions} onChange={setMethod} />
                  <Input
                    placeholder={t_components('http.enterRequestUrl')}
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                  />
                  <Button type='primary' onClick={handleCompareRequest}>
                    {t_common('send')}
                  </Button>
                  <Button onClick={handleSave} style={{ display: 'none' }}>
                    {t_common('save')}
                  </Button>
                </HeaderWrapper>
                <HeaderWrapper style={{ marginTop: '10px' }}>
                  <Select value={method} options={RequestTypeOptions} onChange={setMethod} />
                  <Input
                    placeholder={t_components('http.enterRequestUrl')}
                    value={testUrl}
                    onChange={(e) => setTestUrl(e.target.value)}
                  />
                  <Button style={{ display: 'none' }} type='primary' onClick={handleRequest}>
                    {t_common('send')}
                  </Button>
                  <Button style={{ visibility: 'hidden' }} onClick={handleSave}>
                    {t_common('save')}
                  </Button>
                </HeaderWrapper>
              </div>
            )}

            <Tabs
              defaultActiveKey='1'
              css={css`
                margin-top: 8px;
                .ant-tabs-tab {
                  padding: 8px 0;
                }
                .ant-tabs-nav {
                  margin-bottom: 0;
                }
              `}
            >
              <TabPane
                tab={
                  <span>
                    {t_components('http.params')}
                    {!!paramsCount && <CountTag>{paramsCount}</CountTag>}
                  </span>
                }
                key='0'
              >
                <FormHeader update={setRequestParams} />
                <FormTable
                  bordered
                  size='small'
                  rowKey='id'
                  pagination={false}
                  dataSource={requestParams}
                  //@ts-ignore
                  columns={useColumns(setRequestParams, { editable: true })}
                />
              </TabPane>
              <TabPane
                tab={
                  <>
                    {/* span 若移动至 Badge 中将失去继承的主题色 */}
                    <span>{t_components('http.requestBody')}</span>
                    <Badge dot={!!requestBody} status={method === 'POST' ? 'success' : 'default'}>
                      {/* 空格符撑起 Badge 内部 */}&nbsp;
                    </Badge>
                  </>
                }
                key='1'
              >
                <FormHeaderWrapper>
                  <span>
                    <Label offset={-12}>{t_components('http.contentType')}</Label>
                    <Select
                      disabled
                      bordered={false}
                      value={contentType}
                      size={'small'}
                      options={[{ value: 'application/json', label: 'application/json' }]}
                      onChange={setContentType}
                      style={{ width: '140px', marginLeft: '8px' }}
                    />
                  </span>
                  <Button size='small' onClick={handlePrettier}>
                    {t_common('prettier')}
                  </Button>
                </FormHeaderWrapper>
                <CodeMirror
                  value={requestBody}
                  extensions={[json()]}
                  theme={themeClassify}
                  height='auto'
                  minHeight={'100px'}
                  maxHeight={'240px'}
                  onChange={setRequestBody}
                />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    {t_components('http.requestHeaders')}{' '}
                    {!!headerCount && <CountTag>{headerCount}</CountTag>}
                  </span>
                }
                key='2'
              >
                <FormHeader update={setRequestHeaders} />
                <FormTable
                  bordered
                  size='small'
                  rowKey='id'
                  pagination={false}
                  dataSource={requestHeaders}
                  //@ts-ignore
                  columns={useColumns(setRequestHeaders, { editable: true })}
                />
              </TabPane>
              <TabPane tab={t_components('http.authorization')} key='3' disabled>
                <CodeMirror value='' extensions={[json()]} theme={themeClassify} height='300px' />
              </TabPane>
              <TabPane tab={t_components('http.pre-requestScript')} key='4' disabled>
                <CodeMirror
                  value=''
                  height='300px'
                  extensions={[javascript()]}
                  theme={themeClassify}
                />
              </TabPane>
              <TabPane
                tab={
                  TestVal ? (
                    <Badge dot={true} offset={[-1, 11]} color='#10B981'>
                      <div
                        css={css`
                          padding-right: 10px;
                        `}
                      >
                        {t_components('http.test')}
                      </div>
                    </Badge>
                  ) : (
                    <>{t_components('http.test')}</>
                  )
                }
                key='5'
                disabled={mode === HttpRequestMode.Compare}
              >
                <ResponseTest getTestVal={getTestVal} OldTestVal={TestVal}></ResponseTest>
              </TabPane>
              {recordId ? (
                <TabPane tab={'Mock'} key='6'>
                  <div>
                    <Mock recordId={recordId}></Mock>
                  </div>
                </TabPane>
              ) : null}
            </Tabs>
          </AnimateAutoHeight>
        </Allotment.Pane>

        <Allotment.Pane>
          <div>
            {sent ? (
              <Spin spinning={requesting}>
                {mode === HttpRequestMode.Normal ? (
                  <Response
                    responseHeaders={response?.headers}
                    res={response?.data || response?.statusText}
                    status={{ code: response.status, text: response.statusText }}
                    TestResult={TestResult}
                    isTestResult={isTestResult}
                    time={responseMeta.time > 10000 ? 0 : responseMeta.time}
                    size={responseMeta.size}
                  />
                ) : (
                  // <div>ResponseCompare</div>
                  <ResponseCompare responses={[baseResponse?.data, testResponse?.data]} />
                )}
              </Spin>
            ) : (
              <ResponseWrapper>
                <Spin spinning={requesting}>
                  <Empty
                    description={
                      <Typography.Text type='secondary'>
                        {t_components('http.responseNotReady')}
                      </Typography.Text>
                    }
                  />
                </Spin>
              </ResponseWrapper>
            )}
          </div>
        </Allotment.Pane>
      </Allotment>

      {/*<Divider />*/}
    </>
  );
};

export default HttpRequest;
