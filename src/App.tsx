import { ThemeProvider } from "@emotion/react";
import React from "react";
import { useRoutes } from "react-router-dom";

import CheckChromeExtension from "./components/CheckChromeExtension";
import routerConfig from "./routers";
import { useStore } from "./store";
import { themeCreator } from "./style/theme";

const App: React.FC = () => {
  const content = useRoutes(routerConfig);
  const themeName = useStore((state) => state.theme);
  const theme = themeCreator(themeName);

  return (
    <ThemeProvider theme={theme}>
      <CheckChromeExtension />
      {content}
    </ThemeProvider>
  );
};

export default App;
