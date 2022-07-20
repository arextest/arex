import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import App from "./App";
import "antd/dist/antd.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter><App /></BrowserRouter>,
);
