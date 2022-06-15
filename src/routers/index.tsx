import React from "react";
import MainBox from "../components/MainBox";
import Home from "../pages/Home";

export default [
  {
    path: "/",
    element: <MainBox />,
    children: [{ path: "/home", element: <Home /> }],
  },
];
