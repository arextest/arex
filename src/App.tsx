import "./style/index.less";

import { LoadingOutlined } from "@ant-design/icons";
import { ConfigProvider, Spin, theme } from "antd";
import { HttpProvider } from "./components/arex-request";
import React from "react";
import { useRoutes } from "react-router-dom";

import { useAuthentication, useCheckChrome, useInit } from "./hooks";
import routerConfig from "./router";
import { useStore } from "./store";
import { AliasToken } from "antd/es/theme/interface";
import useUserProfile from "./store/useUserProfile";

const { darkAlgorithm, compactAlgorithm } = theme;
const { darkAlgorithm } = theme;

// global Spin config
Spin.setDefaultIndicator(<LoadingOutlined style={{ fontSize: 24 }} spin />);

function App() {
  useCheckChrome();
  useAuthentication();
  useInit();

  const routesContent = useRoutes(routerConfig);

  const { collectionTreeData, currentEnvironment } = useStore();
  const { language, theme } = useUserProfile();

  const token: Partial<AliasToken> = {
    colorPrimary: "#cf1322",
    colorSuccess: "#66bb6a",
    colorInfo: "#29b6f6",
    colorWarning: "#ffa726",
    colorError: "#f44336",
    colorBorder: "#F0F0F0",
  };

  return (
    <ConfigProvider
      theme={{
        token,
        algorithm: [],
      }}
    >
      <HttpProvider
        theme={theme}
        locale={{ "zh-CN": "cn", "en-US": "en" }[language]}
        collectionTreeData={collectionTreeData}
        environment={currentEnvironment}
      >
        {routesContent}
      </HttpProvider>
    </ConfigProvider>
  );
}

export default App;
