import './i18n';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/jsx/jsx.js';
import 'codemirror/theme/idea.css';
import 'jsoneditor/dist/jsoneditor.min.css';

import { ClickToComponent } from 'click-to-react-component';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <App />
    <ClickToComponent />
  </BrowserRouter>,
);
