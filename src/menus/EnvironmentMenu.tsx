import {
  CheckCircleFilled,
  CheckCircleOutlined,
  DashOutlined,
  MenuOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Button, Dropdown, Input, Menu, Modal, Tooltip } from 'antd';
import React, { FC, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { generateGlobalPaneId, parseGlobalPaneId } from '../helpers/utils';
import { PagesType } from '../pages';
import EnvironmentService from '../services/Environment.service';
import { useStore } from '../store';
import { MenusType } from './index';

type EnvironmentKeyValues = { key: string; value: string; active: boolean };
type EnvironmentType = {
  envName: string;
  id: string;
  keyValues: EnvironmentKeyValues[];
  workspaceId: string;
};

const MenuList = styled(Menu, { shouldForwardProp: (propName) => propName !== 'small' })<{
  small?: boolean;
}>`
  border: none !important;
  background: transparent !important;
  .ant-menu-item {
    margin: 4px 0 !important;
    height: ${(props) => (props.small ? '24px' : '28px')};
    line-height: ${(props) => (props.small ? '24px' : '28px')};
    border-radius: 2px;
    background: transparent !important;
    padding: 0;
  }
  .ant-menu-item-active {
    color: inherit !important;
    background-color: ${(props) => props.theme.color.active} !important;
  }
  .ant-menu-item-selected {
    background-color: ${(props) => props.theme.color.selected} !important;
  }
  .ant-menu-item-active.ant-menu-item-selected {
    color: ${(props) => props.theme.color.primary} !important;
  }
  .btnSelected {
    padding: 2px 0;
    &:hover {
      background-color: ${(props) => props.theme.color.background.hover} !important;
    }
  }
  .btnHover {
    padding: 2px 0;
    &:hover {
      background-color: ${(props) => props.theme.color.background.hover};
    }
  }
`;

const ItemLabel = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 18px;
  & > span:first-of-type {
    width: calc(100% - 56px);
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
  }
`;

const Environment: FC = () => {
  const params = useParams();

  const {
    setPages,
    activeMenu,
    environmentTreeData,
    setEnvironmentTreeData,
    currentEnvironment,
    setCurrentEnvironment,
    activeEnvironment,
    setActiveEnvironment,
  } = useStore();

  const [iconIsShow, setIconIsShow] = useState('');
  const [open, setOpen] = useState(false);
  const [activeEnvironmentItem, setActiveEnvironmentItem] = useState({});
  const [renameValue, setRenameValue] = useState('');
  const [renameKey, setRenameKey] = useState('');
  const [searchEnvironmentData, setSearchEnvironmentData] = useState([]);

  const value = parseGlobalPaneId(activeMenu[1])['rawId'];
  const selectedKeys = useMemo(() => (value ? [value] : []), [value]);

  const handleSelect = (rowData: any) => {
    const info: any = environmentTreeData.find((e) => e.id == rowData.key);
    const data = {
      title: info.envName,
      key: info.id,
      pageType: 'environment',
      qid: info.id,
      isNew: true,
      keyValues: info.keyValues,
    };

    setActiveEnvironment(info.id);
    setPages(
      {
        title: info.envName,
        menuType: MenusType.Environment,
        pageType: PagesType.Environment,
        isNew: false,
        data,
        paneId: generateGlobalPaneId(MenusType.Environment, PagesType.Environment, info.id),
        rawId: info.id,
      },
      'push',
    );
  };

  const { run: fetchEnvironmentData } = useRequest(
    () => EnvironmentService.getEnvironment({ workspaceId: params.workspaceId as string }),
    {
      ready: !!params.workspaceId,
      refreshDeps: [params.workspaceId],
      onSuccess(res) {
        setSearchEnvironmentData(res);
        setEnvironmentTreeData(res);
      },
    },
  );

  const environmentItemOperation = (e: string, data: EnvironmentType) => {
    setActiveEnvironmentItem(data);
    if (e == 'delete') {
      setOpen(true);
    } else if (e == 'rename') {
      setRenameValue(data.envName);
      setRenameKey(data.id);
    }
  };

  const duplicateEnvironment = (data: EnvironmentType) => {
    EnvironmentService.duplicateEnvironment({ id: data.id, workspaceId: data.workspaceId }).then(
      (res) => {
        if (res.body.success == true) {
          fetchEnvironmentData();
        } else {
          console.log(res, 'duplicaterror');
        }
      },
    );
  };

  const handleOk = (e: string) => {
    if (e == 'delete') {
      EnvironmentService.deleteEnvironment({
        id: activeEnvironmentItem.id,
        workspaceId: activeEnvironmentItem.workspaceId,
      }).then((res) => {
        if (res.body.success == true) {
          fetchEnvironmentData();
          setOpen(false);
        } else {
          console.log(res, 'deleteError');
        }
      });
    }
  };

  //修改envName
  const rename = () => {
    if (activeEnvironmentItem.envName == renameValue) {
      setRenameValue('');
      setRenameKey('');
      return;
    }
    let env: any;
    if (activeEnvironment && activeEnvironment.id == activeEnvironmentItem.id) {
      env = { ...activeEnvironment, envName: renameValue };
    } else {
      env = { ...activeEnvironmentItem, envName: renameValue };
    }

    EnvironmentService.saveEnvironment({ env: env }).then((res) => {
      if (res.body.success == true) {
        if (activeEnvironment && activeEnvironment.id == env.id) {
          setActiveEnvironment(env);
        }
        setRenameValue('');
        setRenameKey('');
        fetchEnvironmentData();
      }
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  //搜索
  const searchEnvironment = (val: string) => {
    const searchData = environmentTreeData.filter((data: any) => data.envName.includes(val));
    setSearchEnvironmentData(searchData);
  };

  const menu = (data: EnvironmentType) => {
    return (
      <Menu
        onClick={(e) => {
          // e.domEvent.stopPropagation();
          switch (e.key) {
            case '3':
              duplicateEnvironment(data);
              break;
            case '4':
              environmentItemOperation('rename', data);
              break;
            case '5':
              environmentItemOperation('delete', data);
          }
        }}
        items={[
          // {
          //   key: '1',
          //   label: <span onClick={() => {}}>share</span>,
          //   disabled: true,
          // },
          // {
          //   key: '2',
          //   label: <span onClick={() => {}}>Move</span>,
          //   disabled: true,
          // },
          {
            key: '3',
            label: <span className={'dropdown-click-target'}>Duplicate</span>,
          },
          {
            key: '4',
            label: <span className={'dropdown-click-target'}>Rename</span>,
          },
          {
            key: '5',
            label: (
              <span style={{ color: 'red' }} className={'dropdown-click-target'}>
                Delete
              </span>
            ),
          },
        ]}
      />
    );
  };

  const items = searchEnvironmentData.map((data: EnvironmentType) => {
    return {
      label: (
        <ItemLabel
          onMouseEnter={() => {
            setIconIsShow(data.id);
          }}
          onMouseLeave={() => {
            setIconIsShow('');
          }}
          onKeyDown={(e) => {
            if (e.key == 'Enter') {
              e.stopPropagation();
            }
          }}
        >
          {renameKey === data.id ? (
            <span>
              <Input
                autoFocus
                style={{ padding: '0 4px', width: '100%' }}
                value={renameValue}
                onBlur={rename}
                onPressEnter={rename}
                onChange={(val) => setRenameValue(val.target.value)}
              />
            </span>
          ) : (
            <span>{data.envName}</span>
          )}
          <span onClick={(event) => event.stopPropagation()}>
            {currentEnvironment && currentEnvironment.id == data.id ? (
              data.id == iconIsShow ? (
                <CheckCircleFilled
                  onClick={() => {
                    data.id == currentEnvironment.id
                      ? setCurrentEnvironment('0')
                      : setCurrentEnvironment(data.id);
                  }}
                />
              ) : (
                <>
                  <CheckCircleFilled onClick={() => setCurrentEnvironment(data.id)} />
                  <span
                    css={css`
                      display: inline-block;
                      width: 14px;
                    `}
                  ></span>
                </>
              )
            ) : data.id == iconIsShow ? (
              <CheckCircleOutlined
                className={
                  activeEnvironment && activeEnvironment.id == iconIsShow
                    ? 'btnSelected'
                    : 'btnHover'
                }
                onClick={() => setCurrentEnvironment(data.id)}
              />
            ) : null}
            {data.id == iconIsShow ? (
              <Dropdown overlay={menu(data)} trigger={['click']}>
                <DashOutlined
                  className={
                    activeEnvironment && activeEnvironment.id == iconIsShow
                      ? 'btnSelected'
                      : 'btnHover'
                  }
                />
              </Dropdown>
            ) : null}
          </span>
        </ItemLabel>
      ),
      key: data.id,
    };
  });

  return (
    <div>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          margin-bottom: 10px;
        `}
      >
        <Tooltip placement='bottomLeft' title={'Create New'} mouseEnterDelay={0.5}>
          <Button
            css={css`
              margin-right: 5px;
            `}
            icon={<PlusOutlined />}
            type='text'
            size='small'
            onClick={() => {
              const CreateEnvironment = {
                env: { envName: 'New Environment', workspaceId: params.workspaceId, keyValues: [] },
              };
              EnvironmentService.saveEnvironment(CreateEnvironment).then((res) => {
                if (res.body.success == true) {
                  fetchEnvironmentData();
                }
              });
            }}
          />
        </Tooltip>
        <Input
          className={'environment-header-search'}
          size='small'
          placeholder=''
          onChange={(val) => searchEnvironment(val.target.value)}
          prefix={<MenuOutlined />}
        />
      </div>
      <MenuList items={items} selectedKeys={selectedKeys} onClick={handleSelect} />
      <Modal
        title={`Delete "${activeEnvironmentItem.envName}"`}
        okText='Delete'
        open={open}
        onOk={() => handleOk('delete')}
        onCancel={handleCancel}
      >
        <p>
          Deleting this environment might cause any monitors or mock servers using it to stop
          functioning properly. Are you sure you want to continue?
        </p>
      </Modal>
    </div>
  );
};
export default Environment;
