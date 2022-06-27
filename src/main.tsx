import "./style/index.less";
import "antd/dist/antd.less";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
// import 'codemirror/mode/js'
import "codemirror/mode/jsx/jsx.js";
import "codemirror/theme/idea.css";
import "jsoneditor/dist/jsoneditor.min.css";
import "./i18n";

// @ts-ignore
import codemirror from "codemirror";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
// @ts-ignore
window.CodeMirror = codemirror;
ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
