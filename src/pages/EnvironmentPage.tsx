import { MenuOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, Form, Input, InputRef, message, Table } from 'antd';
import update from 'immutability-helper';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
const type = 'DraggableBodyRow';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import type { FormInstance } from 'antd/es/form';
import { useParams } from 'react-router-dom';

import EnvironmentService from '../services/Environment.service';
import { useStore } from '../store';
import { PageFC } from './index';

const MainTable = styled(Table)`
  .ant-table-cell {
    &.noLeftBorder {
      border-left: none !important;
    }
    &.noRightBorder {
      border-right: none !important;
      text-align: left !important;
    }
  }
  .hide {
    opacity: 0;
  }
`;
//拖拽
const DraggableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  children,
  rowactiveindex,
  keys,
  ...restProps
}) => {
  const [form] = Form.useForm();
  const ref = useRef(null);
  const dropTargetAndView = useRef(null);
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
  const [collected, drag, dragPreview] = useDrag({
    type,
    item: {
      index,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(ref);
  drop(dropTargetAndView);
  dragPreview(dropTargetAndView);
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr
          ref={dropTargetAndView}
          className={`${className}${isOver ? dropClassName : ''}`}
          style={{
            ...style,
          }}
          {...restProps}
        >
          {children.length ? (
            <td>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <MenuOutlined
                        className={keys !== rowactiveindex ? 'hide' : ''}
                        css={css`
                          cursor: move;
                        `}
                        ref={ref}
                      />
                    </td>
                    {children[0]}
                  </tr>
                </tbody>
              </table>
            </td>
          ) : (
            children
          )}
          {children[1]}
          {children[2]}
          {children[3]}
        </tr>
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
      <div style={{ paddingRight: 24, lineHeight: '32px', cursor: 'pointer' }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const EnvironmentPage: PageFC = () => {
  const params = useParams();
  const { activeEnvironment, setEnvironmentTreeData, setActiveEnvironment } = useStore();

  const [data, setData] = useState<[]>([]);
  const [isActive, setIsActive] = useState<[]>([]);
  const [title, setTitle] = useState<string>('');
  const [rowActiveIndex, setRowActiveIndex] = useState<number>(-1);
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
      colSpan: 2,
      className: 'noRightBorder',
    },
    {
      title: 'operation',
      width: '110px',
      colSpan: 0,
      render: (text, record, index) => (
        <a
          className={record.keys !== rowActiveIndex ? 'hide' : ''}
          onClick={() => deleteEnvironmentItem(text)}
        >
          X
        </a>
      ),
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
    columnWidth: '88px',
    onSelect: (record, selected) => {
      if (selected) {
        setIsActive([...isActive, record.keys]);
      } else {
        setIsActive(isActive.filter((e) => e != record.keys));
      }
    },
    renderCell: (checked, record, index, originNode) => <div>{originNode}</div>,
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
    const newData = data.filter((item) => item.keys !== text.keys);
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
        setActiveEnvironment(env);
        message.success('保存成功');
      } else {
        message.error('保存失败');
      }
    });
  };

  const { run: fetchEnvironmentData } = useRequest(
    () => EnvironmentService.getEnvironment({ workspaceId: params.workspaceId as string }),
    {
      ready: !!params.workspaceId,
      refreshDeps: [params.workspaceId],
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
        <MainTable
          bordered
          rowKey='keys'
          size='small'
          rowClassName={() => 'editable-row'}
          columns={columns}
          dataSource={data}
          components={components}
          pagination={false}
          onRow={(_, index) => {
            const attr = {
              onMouseOver: (event) => {
                setRowActiveIndex(_.keys);
              },
              onMouseOut: (event) => {
                setRowActiveIndex(-1);
              },
              rowactiveindex: rowActiveIndex,
              index,
              moveRow,
              keys: _.keys,
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
