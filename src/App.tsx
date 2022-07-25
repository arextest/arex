import "./components/app/index.less";
import "./components/Collection/index.less";
import "./components/environment/index.less";

import CheckChromeExtension from "./components/CheckChromeExtension";
import { useRoutes } from "react-router-dom";
import routerConfig from "./routers";
import React, { useReducer} from 'react'
export const GlobalContext = React.createContext({})
const initState = {
  userinfo: {
    email:localStorage.getItem('email')
  },
  isLogin:localStorage.getItem('email')?true:false,
}
const reducer = (prevState, action) => {
  let newState = { ...prevState }
  switch (action.type) {
    case 'login':
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
}

export default App;
