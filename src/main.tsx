import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "antd/dist/antd.min.css";
import { BrowserRouter } from "react-router-dom";

// @ts-ignore
import codemirror from 'codemirror'
// @ts-ignore
window.CodeMirror = codemirror
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'
// import 'codemirror/mode/js'
import 'codemirror/mode/vue/vue.js'
import 'codemirror/mode/jsx/jsx.js'
import 'codemirror/theme/idea.css'

import 'jsoneditor/dist/jsoneditor.min.css'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
