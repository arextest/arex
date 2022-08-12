import './Environment.less';

import { MenuOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputRef, message, Table } from 'antd';
import update from 'immutability-helper';
import React, { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
const type = 'DraggableBodyRow';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import type { FormInstance } from 'antd/es/form';
import { useParams } from 'react-router-dom';

import EnvironmentService from '../services/Environment.service';
import { useStore } from '../store';

//拖拽
const DraggableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
  const [form] = Form.useForm();
  const ref = useRef(null);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};

      if (dragIndex === index) {
        return {};
      }

      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
    },
  });

  const [, drag] = useDrag({
    type,
    item: {
      index,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drop(drag(ref));
  // restProps.children[0].ref=ref
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr
          ref={ref}
          className={`${className}${isOver ? dropClassName : ''}`}
          style={{
            cursor: 'move',
            ...style,
          }}
          {...restProps}
        />
      </EditableContext.Provider>
    </Form>
  );
};

//显示框
const EditableContext = React.createContext<FormInstance<any> | null>(null);
interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className='editable-cell-value-wrap'
        style={{ paddingRight: 24, height: 32 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export type EnvironmentProps = {
  id: string;
};

const EnvironmentPage: FC<EnvironmentProps> = ({ id }) => {
  const parmas = useParams();
  const { activeEnvironment, setEnvironmentTreeData } = useStore();

  const [data, setData] = useState<[]>([]);
  const [isActive, setIsActive] = useState<[]>([]);
  const [title, setTitle] = useState<string>('');
  const defaultColumns = [
    {
      title: 'VARIABLE',
      dataIndex: 'key',
      width: '40%',
      editable: true,
    },
    {
      title: 'VALUE',
      dataIndex: 'value',
      width: '45%',
      editable: true,
    },
    {
      title: 'operation',
      render: (text) => <a onClick={() => deleteEnvironmentItem(text)}>Delete</a>,
    },
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const components = {
    body: {
      row: DraggableBodyRow,
      cell: EditableCell,
    },
  };

  useEffect(() => {
    if (activeEnvironment) {
      const EnvironmentActive: string[] = [];
      const EnvironmentKeyValues = activeEnvironment.keyValues.map((e: any, index: number) => {
        if (e.active) {
          EnvironmentActive.push(index);
        }
        return { ...e, keys: index };
      });
      setData(EnvironmentKeyValues);
      setCount(EnvironmentKeyValues.length + 1);
      setIsActive(EnvironmentActive);
      setTitle(activeEnvironment.title || activeEnvironment.envName);
    }
  }, [activeEnvironment]);

  //输入框数据保存
  const handleSave = (row: DataType) => {
    const newData = [...data];
    const index = newData.findIndex((item) => row.keys === item.keys);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setData(newData);
  };

  //拖拽
  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = data[dragIndex];
      setData(
        update(data, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [data],
  );

  //多选框
  const rowSelection = {
    selectedRowKeys: isActive,
    columnWidth: '60px',
    onSelect: (record, selected) => {
      if (selected) {
        setIsActive([...isActive, record.keys]);
      } else {
        setIsActive(isActive.filter((e) => e != record.keys));
      }
    },
    // renderCell:(checked, record, index, originNode)=><div css={css`display:flex;justify-content:space-between`}><div css={css`display:flex;align-items:center`}><MenuOutlined/></div>{originNode}</div>,
  };

  //添加
  const [count, setCount] = useState(0);
  const handleAdd = () => {
    const newData: DataType = {
      key: '',
      value: '',
      keys: count,
      active: 'false',
    };
    setData([...data, newData]);
    setCount(count + 1);
  };

  //删除
  const deleteEnvironmentItem = (text) => {
    const newData = data.filter((item) => item.key !== text.key);
    setData(newData);
  };

  //保存
  const SaveEnvironment = () => {
    const newData = data.map((e: any) => {
      if (isActive.includes(e.keys)) {
        e.active = true;
        return { key: e.key, active: e.active, value: e.value };
      } else {
        e.active = false;
        return { key: e.key, active: e.active, value: e.value };
      }
    });
    const env = { ...activeEnvironment };
    env.keyValues = newData;
    EnvironmentService.saveEnvironment({ env: env }).then((res) => {
      if (res.body.success == true) {
        fetchEnvironmentData();
        message.success('保存成功');
      } else {
        message.error('保存失败');
      }
    });
  };

  const { run: fetchEnvironmentData } = useRequest(
    () => EnvironmentService.getEnvironment({ workspaceId: parmas.workspaceId as string }),
    {
      ready: !!parmas.workspaceId,
      refreshDeps: [parmas.workspaceId],
      onSuccess(res) {
        setEnvironmentTreeData(res);
      },
    },
  );

  return (
    <>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        `}
      >
        <div>{title}</div>
        <div>
          <Button onClick={handleAdd}>Add</Button> <Button onClick={SaveEnvironment}>Save</Button>
        </div>
      </div>
      <DndProvider backend={HTML5Backend}>
        <Table
          rowKey='keys'
          bordered
          rowClassName={() => 'editable-row'}
          columns={columns}
          dataSource={data}
          components={components}
          onRow={(_, index) => {
            const attr = {
              index,
              moveRow,
            };
            return attr;
          }}
          rowSelection={{
            hideSelectAll: true,
            ...rowSelection,
          }}
        />
      </DndProvider>
    </>
  );
};

export default EnvironmentPage;
