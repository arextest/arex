import { Tag } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const AppFooter = () => {
  return (
    <div className={"app-footer"}>
      <div>{/*left*/}</div>
      <div>
        {/*right*/}
        {window.__AREX_EXTENSION_INSTALLED__ ? (
          <div>
            <CheckCircleOutlined style={{ color: "rgb(82, 196, 26)" }} />
            <span style={{ color: "#6b6b6b", marginLeft: "3px" }}>
              Browser Agent
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AppFooter;
