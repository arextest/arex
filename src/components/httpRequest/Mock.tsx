import { useMount } from 'ahooks';
import { Table } from 'antd';
import { useState } from 'react';

import request from '../../api/axios';
import { tryParseJsonString } from '../../helpers/utils';

const Mock = () => {
  const [dataSource, setDataSource] = useState([]);

  const columns = [
    {
      title: 'appId',
      dataIndex: 'appId',
    },
    {
      title: 'createTime',
      dataIndex: 'createTime',
    },
    {
      title: 'method',
      dataIndex: 'method',
    },
    {
      title: 'path',
      dataIndex: 'path',
    },
    {
      title: 'pattern',
      dataIndex: 'pattern',
    },
    {
      title: 'recordId',
      dataIndex: 'recordId',
    },

    {
      title: 'request',
      dataIndex: 'request',
    },
    //
    {
      title: 'requestHeaders',
      dataIndex: 'requestHeaders',
    },
    //
    // {
    //   title: 'response',
    //   dataIndex: 'response',
    // },
    {
      title: 'responseHeaders',
      dataIndex: 'responseHeaders',
    },
    // {
    //   title: '年龄',
    //   dataIndex: 'age',
    //   key: 'age',
    // },
    // {
    //   title: '住址',
    //   dataIndex: 'address',
    //   key: 'address',
    // },
  ];
  useMount(() => {
    request
      .post(`/storage/frontEnd/record/queryRecord`, {
        recordId: 'AREX-172-17-0-2-72773767300242',
        categoryTypes: 0,
      })
      .then((res) => {
        const arr = [];
        Object.keys(res.recordResult).forEach((item) => {
          arr.push({
            key: item,
            ...tryParseJsonString(res.recordResult[item]),
          });
        });
        setDataSource(arr.filter((i) => i.appId));
      });
  });
  return (
    <div>
      {JSON.stringify(dataSource.appId)}
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default Mock;
