import { ArexPaneFC, createArexPane } from '@arextest/arex-core';
import { ArexRequest, ArexRequestProps, ArexRESTRequest } from '@arextest/arex-request';
import React, { useMemo, useRef } from 'react';

import { MenusType, PanesType } from '@/constant';
import { requestCollection } from '@/mocks/requestCollection';
import { decodePaneKey } from '@/store/useMenusPanes';

const Request: ArexPaneFC = (props) => {
  const httpRef = useRef(null);
  const { id } = decodePaneKey(props.paneKey);

  const onSave: ArexRequestProps['onSave'] = (r) => {
    console.log('onSave');
  };

  // request
  const testReqData = useMemo<ArexRESTRequest | undefined>(
    () => requestCollection.find((r) => r.id === id),
    [id],
  );

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
        height='calc(100vh - 110px)'
        onSave={onSave}
        data={testReqData}
        environmentId={'env-1'}
        environments={[
          {
            id: 'env-1',
            name: 'dev',
            variables: [{ key: 'url', value: 'http://124.223.27.177:18080' }],
          },
        ]}
        config={httpConfig}
        breadcrumbItems={[{ title: 'Test' }, { title: 'arex' }, { title: 'echo' }]}
        onChange={({ title, tags, description }) => {
          console.log(title, tags, description);
        }}
        tags={['sd']}
        tagOptions={[{ color: 'blue', value: 'sd', label: 'd' }]}
        description={'description'}
        onSaveAs={() => {
          console.log('onSaveAs');
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
