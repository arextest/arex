import { Button } from "antd";
import {useState} from "react";
import BottomComponent from "./BottomComponent";

const Http = () => {
  const [count, setCount] = useState(0);
  return <div style={{fontStyle:'12px'}}>
    <BottomComponent></BottomComponent>
  </div>;
};

export default Http;
