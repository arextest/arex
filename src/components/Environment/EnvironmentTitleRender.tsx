import { CheckCircleOutlined, DashOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Dropdown, Input, Menu, Modal, Space } from 'antd';
import ListBody from 'antd/lib/transfer/ListBody';
import { useState } from 'react';

import EnvironmentService from '../../services/Environment.service';
import { useStore } from '../../store';

const btnCss = css`
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  margin-right: 5px;
  &:hover {
    background: #eee;
  }
`;
export type Environmentprops = {
  val: any;
  titleRadius: string;
  updateDirectorytreeData: () => void;
};

function EnvironmentTitleRender({ val, titleRadius, updateDirectorytreeData }: Environmentprops) {
  const environment = useStore((state) => state.environment);
  const setEnvironment = useStore((state) => state.setEnvironment);
  const [visible, setVisible] = useState(false);
  const [isRenameVisible, setIsRenameVisible] = useState<boolean>(false);
  const [environmentname, setEnvironmentname] = useState<string>(val.envName);

  const selectEnvironment = () => {
    if (val.id == environment) {
      setEnvironment('0');
    } else {
      setEnvironment(val.id);
    }
  };

  const handleVisibleChange = (e) => {
    setVisible(e);
  };

  //删除
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (e: string) => {
    if (e == 'rename') {
      setIsRenameVisible(true);
    } else if (e == 'delete') {
      setIsModalVisible(true);
    }
  };

  const handleOk = (e: string) => {
    if (e == 'delete') {
      EnvironmentService.deleteEnvironment(val.id).then((res) => {
        if (res.body.success == true) {
          updateDirectorytreeData();
          setIsModalVisible(false);
        } else {
          console.log('deleteError');
        }
      });
    } else if (e == 'rename') {
      const env = { ...val, envName: environmentname };
      EnvironmentService.saveEnvironment({ env: env }).then((res) => {
        if (res.body.success == true) {
          updateDirectorytreeData();
          setIsRenameVisible(false);
        }
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsRenameVisible(false);
  };

  const menu = (val: any) => {
    return (
      <Menu
        onClick={(e) => {
          e.domEvent.stopPropagation();
          setVisible(false);
        }}
        items={[
          {
            key: '1',
            label: (
              <a target='_blank' onClick={() => {}}>
                share
              </a>
            ),
            disabled: true,
          },
          {
            key: '2',
            label: (
              <a target='_blank' onClick={() => {}}>
                Move
              </a>
            ),
            disabled: true,
          },
          {
            key: '3',
            label: (
              <a target='_blank' onClick={() => {}}>
                Duplicate
              </a>
            ),
            disabled: true,
          },
          {
            key: '4',
            label: (
              <a target='_blank' onClick={() => showModal('rename')}>
                Rename
              </a>
            ),
          },
          {
            key: '5',
            label: (
              <a style={{ color: 'red' }} onClick={() => showModal('delete')}>
                Delete
              </a>
            ),
          },
        ]}
      />
    );
  };
  return (
    <div
      css={css`
        display: flex;
        justify-content: space-between;
      `}
    >
      <div>{val.envName}</div>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
        `}
      >
        {val.id == titleRadius || environment == val.id ? (
          //  TODO 避免写类似hover这种涉及全局统一风范的样式，如写确保风格统一
          // 此处建议使用 <Button type="text" icon={<CheckCircleOutlined/>}>
          <div css={btnCss} onClick={(event) => event.stopPropagation()}>
            <CheckCircleOutlined onClick={selectEnvironment} />
          </div>
        ) : (
          <></>
        )}
        {/* {val.id==titleRadius? */}
        <Dropdown
          overlay={menu(val)}
          trigger={['click']}
          visible={visible}
          onVisibleChange={handleVisibleChange}
        >
          <div onClick={(event) => event.stopPropagation()} css={btnCss}>
            <Space>
              <DashOutlined />
            </Space>
          </div>
        </Dropdown>
        {/* :<div css={btnCss}></div>} */}
      </div>
      <Modal
        title={`Delete "${val.envName}"`}
        okText='Delete'
        visible={isModalVisible}
        onOk={() => handleOk('delete')}
        onCancel={handleCancel}
      >
        <p>
          Deleting this environment might cause any monitors or mock servers using it to stop
          functioning properly. Are you sure you want to continue?
        </p>
      </Modal>
      <Modal
        title='rename'
        visible={isRenameVisible}
        onOk={() => handleOk('rename')}
        onCancel={handleCancel}
      >
        <Input
          value={environmentname}
          onChange={(e) => {
            setEnvironmentname(e.target.value);
          }}
        ></Input>
      </Modal>
    </div>
  );
}

export default EnvironmentTitleRender;
