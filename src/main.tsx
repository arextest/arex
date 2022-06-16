import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "antd/dist/antd.min.css";
import { BrowserRouter } from "react-router-dom";
import {CssBaseline} from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </BrowserRouter>,
);
