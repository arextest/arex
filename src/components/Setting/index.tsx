import styled from '@emotion/styled';
import { Modal, Tabs } from 'antd';
import { FC } from 'react';
const { TabPane } = Tabs;

type Props = {
  isModalVisible: boolean;
  setModalVisible: (isVisible: boolean) => void;
};

const Tabsddd = styled(Tabs)`
  .ant-tabs-nav-list {
    margin-left: 12px;
  }
`;

const Setting: FC<Props> = ({ isModalVisible, setModalVisible }) => {
  function handleOk() {
    setModalVisible(false);
  }
  function handleCancel() {
    setModalVisible(false);
  }
  return (
    <div>
      <Modal
        bodyStyle={{ padding: '0' }}
        title='SETTINGS'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tabsddd defaultActiveKey='1' onChange={() => {}}>
          <TabPane tab='Tab 1' key='1'>
            <div style={{ padding: '20px' }}>ddd</div>
          </TabPane>
          <TabPane tab='Tab 2' key='2'>
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab='Tab 3' key='3'>
            Content of Tab Pane 3
          </TabPane>
        </Tabsddd>
      </Modal>
    </div>
  );
};
export default Setting;
