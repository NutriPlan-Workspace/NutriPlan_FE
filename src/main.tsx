import React from 'react';
import ReactDOM from 'react-dom/client';

import ToastProvider from '@/contexts/ToastContext';

import App from './App.js';

import './index.css';

const rootElement = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>,
);
