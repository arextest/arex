import "./components/app/index.less";
import "./components/collection/index.less";
import "./components/environment/index.less";
import MainBox from "./layouts/mainbox";
import CheckChromeExtension from "./components/CheckChromeExtension";
import {useRoutes} from "react-router-dom";
import routerConfig from "./routers";

function App() {
  const useRoutesRouterConfig = useRoutes(routerConfig);
  return <>
    <CheckChromeExtension />
    {useRoutesRouterConfig}
  </>;
}

export default App;
