import { ArexPaneFC, createArexPane } from '@arextest/arex-core';
import { ArexRequest, ArexRequestProps, sendRequest } from '@arextest/arex-request';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { MenusType, PanesType } from '@/constant';
import { requestCollection } from '@/mocks/requestCollection';

const treeData = [
  {
    value: 'parent 1',
    title: 'parent 1',
    children: [
      {
        value: 'parent 1-0',
        title: 'parent 1-0',
        disabled: true,
        children: [
          {
            value: 'leaf1',
            title: 'leaf1',
          },
          {
            value: 'leaf2',
            title: 'leaf2',
          },
        ],
      },
      {
        value: 'parent 1-1',
        title: 'parent 1-1',
      },
    ],
  },
];

const Request: ArexPaneFC = () => {
  const httpRef = useRef(null);
  const onSave: ArexRequestProps['onSave'] = (r) => {
    console.log(r);
  };
  const [selectedKey, setSelectedKey] = useState('-1');
  function onSend(request: any, environment: any) {
    return sendRequest(request, environment).then((res: any) => {
      return {
        response: res.response,
        testResult: res.testResult,
        consoles: res.consoles,
        visualizer: res.visualizer,
      };
    });
  }
  // request
  const testReqData = useMemo(() => {
    return requestCollection.find((r) => r.id === selectedKey);
  }, [selectedKey]);
  // collection
  const httpConfig = useMemo(
    () => ({
      requestTabs: {
        extra: [
          {
            label: 'Mock',
            key: 'mock',
            hidden: true,
            children: <div>mock</div>,
          },
          // {
          //   label: t('http.compare_config'),
          //   key: 'compareConfig',
          //   hidden: nodeType === 2,
          //   children: (
          //     <ExtraTabs.RequestTabs.CompareConfig
          //       interfaceId={id}
          //       operationId={data?.operationId}
          //     />
          //   ),
          // },
        ],
      },
      responseTabs: {
        extra: [],
      },
    }),
    [testReqData],
  );

  return (
    <>
      <ArexRequest
        disableSave={true}
        ref={httpRef}
        collection={treeData}
        height={`calc(100vh - 110px)`}
        // 以上是配置
        onSend={(request) => {
          return onSend(request, {
            name: 'dev',
            variables: [{ key: 'url', value: 'http://124.223.27.177:18080' }],
          });
        }}
        onSave={onSave}
        value={testReqData}
        environment={{
          name: 'dev',
          variables: [{ key: 'url', value: 'http://124.223.27.177:18080' }],
        }}
        config={httpConfig}
        breadcrumbItems={[{ title: 'Test' }, { title: 'hoppscotch' }, { title: 'echo' }]}
        onChange={({ value, tags, description }) => {
          console.log(value, tags, description);
        }}
        tags={['sd']}
        tagOptions={[{ color: 'blue', value: 'sd', label: 'd' }]}
        description={'description'}
        onSaveAs={() => {
          console.log();
        }}
      />
    </>
  );
};

export default createArexPane(Request, {
  type: PanesType.REQUEST,
  menuType: MenusType.COLLECTION,
  noPadding: true,
});
