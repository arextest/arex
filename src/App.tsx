import "./components/app/index.less";
import "./components/Collection/index.less";
import "./components/environment/index.less";

import CheckChromeExtension from "./components/CheckChromeExtension";
import { useRoutes } from "react-router-dom";
import routerConfig from "./routers";
import React, {useContext, useReducer} from 'react'
export const GlobalContext = React.createContext({})
const initState = {
  userinfo: {
    email:localStorage.getItem('email')
  },
  isLogin:localStorage.getItem('email')?true:false,
  b: "22222"
}
const reducer = (prevState, action) => {
  let newState = { ...prevState }
  switch (action.type) {
    case "child2":
      newState.a = "aaaa";
      return newState;
    case "child3":
      newState.b = "bbbb";
      return newState;
    case 'login':
      console.log(action,'aaa')
      newState.userinfo.email = action.payload
      newState.isLogin = true
      return newState
    default: return newState;
  }

}
function App() {
  const [state, dispatch] = useReducer(reducer, initState)
  const useRoutesRouterConfig = useRoutes(routerConfig);
  return <GlobalContext.Provider  value={
    {
      state: state,
      dispatch: dispatch
    }
  }
  >
    <CheckChromeExtension />
    {useRoutesRouterConfig}
  </GlobalContext.Provider>
  // return <><CheckChromeExtension />{useRoutesRouterConfig}</>;
}

export default App;
