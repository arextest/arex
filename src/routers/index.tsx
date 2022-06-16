import React from "react";
import MainBox from "../components/MainBox";
import Home from "../pages/Home";
import Normal from "../pages/Normal";
import Compare from "../pages/Compare";
import Replay from "../pages/Replay";
import Setting from "../pages/Setting";

export default [
  {
    path: "/",
    element: <MainBox />,
    children: [
      { path: "/", element: <Normal /> },
      { path: "/setting", element: <Setting /> },
      { path: "/normal", element: <Normal /> },
      { path: "/compare", element: <Compare /> },
      { path: "/replay", element: <Replay /> },
    ],
  },
];
