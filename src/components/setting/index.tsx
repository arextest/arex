import { Modal } from "antd";
import { FC } from "react";

type Props = {
  isModalVisible: boolean;
  setModalVisible: (isVisible: boolean) => void;
};

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
        title="SETTINGS"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
};
export default Setting;
