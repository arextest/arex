import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Input, message, Popconfirm, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FC, useState } from 'react';
import { Updater, useImmer } from 'use-immer';

import ReplayService from '../../../../services/Replay.service';
import { DynamicClass } from '../../../../services/Replay.type';
import TooltipButton from '../../../TooltipButton';

export type DynamicClassesEditableTableProps = {
  appId: string;
};

const EDIT_ROW_KEY = '__edit_row__';
const InitRowData = {
  id: EDIT_ROW_KEY,
  fullClassName: '',
  // methodName: '',
  // parameterTypes: '',
  // keyFormula: '',
};

const DynamicClassesEditableTable: FC<DynamicClassesEditableTableProps> = (props) => {
  const [editable, setEditable] = useState(true);
  const [dataSource, setDataSource] = useImmer<DynamicClass[]>([]);

  const columns = (paramsUpdater: Updater<DynamicClass[]>): ColumnsType<DynamicClass> => {
    const handleChange = (attr: keyof DynamicClass, value: string) => {
      paramsUpdater((params) => {
        // @ts-ignore
        params[0][attr] = value;
      });
    };

    return [
      {
        title: 'Full Class Name (e.g. java.lang.String)',
        dataIndex: 'fullClassName',
        key: 'fullClassName',
        render: (text, record) =>
          EDIT_ROW_KEY === record.id ? (
            <Input value={text} onChange={(e) => handleChange('fullClassName', e.target.value)} />
          ) : (
            text
          ),
      },
      // 隐藏下面三列
      // {
      //   title: 'Function Name',
      //   dataIndex: 'methodName',
      //   key: 'methodName',
      //   render: (text, record) =>
      //     EDIT_ROW_KEY === record.id ? (
      //       <Input value={text} onChange={(e) => handleChange('methodName', e.target.value)} />
      //     ) : (
      //       text
      //     ),
      // },
      // {
      //   title: 'Parameter Types',
      //   dataIndex: 'parameterTypes',
      //   key: 'parameterTypes',
      //   render: (text, record) =>
      //     EDIT_ROW_KEY === record.id ? (
      //       <Input value={text} onChange={(e) => handleChange('parameterTypes', e.target.value)} />
      //     ) : (
      //       text
      //     ),
      // },
      // {
      //   title: 'Key Formula',
      //   dataIndex: 'keyFormula',
      //   key: 'keyFormula',
      //   render: (text, record) =>
      //     EDIT_ROW_KEY === record.id ? (
      //       <Input value={text} onChange={(e) => handleChange('keyFormula', e.target.value)} />
      //     ) : (
      //       text
      //     ),
      // },
      {
        title: 'Action',
        key: 'actions',
        width: 72,
        align: 'center',
        className: 'actions',
        render: (text, record) => (
          <Space>
            {EDIT_ROW_KEY === record.id && (
              <TooltipButton
                title={'Save'}
                type='text'
                size='small'
                icon={<SaveOutlined />}
                onClick={() => {
                  update({ ...record, appId: props.appId, configType: 0 });
                }}
              />
            )}

            <Popconfirm
              title='Are you sure to delete this record?'
              onConfirm={() => {
                if (record.id === EDIT_ROW_KEY) {
                  setEditable(true);
                  setDataSource((state) => {
                    state.shift();
                  });
                } else if (record.id) {
                  remove({ appId: props.appId, id: record.id as string });
                }
              }}
              okText='Yes'
              cancelText='No'
            >
              <Button type='text' size='small' icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      },
    ];
  };

  const handleAddRecord = () => {
    setEditable(false);
    setDataSource((state) => {
      state.unshift(InitRowData);
    });
  };

  const { run: reload, loading } = useRequest(ReplayService.queryRecordDynamicClassSetting, {
    defaultParams: [{ appId: props.appId }],
    onSuccess(res) {
      setEditable(true);
      setDataSource(res || []);
    },
  });

  const { run: update } = useRequest(ReplayService.updatedDynamicClassSetting, {
    manual: true,
    onSuccess(res) {
      res ? reload({ appId: props.appId }) : message.error('saveFail');
    },
    onError(e) {
      console.error(e);
      message.error('saveFail');
    },
  });

  const { run: remove } = useRequest(ReplayService.removeDynamicClassSetting, {
    manual: true,
    onSuccess(res) {
      res ? reload({ appId: props.appId }) : message.error('deleteFailed');
    },
    onError(e) {
      console.error(e);
      message.error('deleteFailed');
    },
  });

  return (
    <>
      <Table
        rowKey='id'
        size='small'
        loading={loading}
        dataSource={dataSource}
        columns={columns(setDataSource)}
        pagination={false}
      />

      <Button
        icon={<PlusOutlined />}
        disabled={!editable}
        onClick={handleAddRecord}
        style={{ marginTop: '8px' }}
      >
        Add
      </Button>
    </>
  );
};

export default DynamicClassesEditableTable;
