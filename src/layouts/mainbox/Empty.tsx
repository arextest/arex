import { Button, Empty } from "antd";
import { FC, useContext } from "react";
import { GlobalContext } from "../../App";

const PaneAreaEmpty: FC<any> = ({ add }) => {
  const value = useContext(GlobalContext);
  return (
    <Empty>
      <Button type="primary" onClick={() => add()}>{value.title}</Button>
    </Empty>
  );
};

export default PaneAreaEmpty;
