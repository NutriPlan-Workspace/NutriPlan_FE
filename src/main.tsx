import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { StyleProvider } from '@ant-design/cssinjs';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { ConfigProvider } from 'antd';

import ToastProvider from '@/contexts/ToastContext';
import { store } from '@/redux/store';

import { routeTree } from './routeTree.gen';

import './index.css';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <StyleProvider layer>
      <Provider store={store}>
        <ToastProvider>
          <ConfigProvider
            theme={{
              token: {
                fontFamily: '"TT Norms", sans-serif',
              },
            }}
          >
            <RouterProvider router={router} />
          </ConfigProvider>
        </ToastProvider>
      </Provider>
    </StyleProvider>
  </StrictMode>,
);
