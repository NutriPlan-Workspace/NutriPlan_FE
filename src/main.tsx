import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { StyleProvider } from '@ant-design/cssinjs';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { ConfigProvider } from 'antd';

import { DateProvider } from '@/contexts/DateContext';
import ToastProvider from '@/contexts/ToastContext';
import { store } from '@/redux/store';

import '@ant-design/v5-patch-for-react-19';

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
          <DateProvider>
            <ConfigProvider
              theme={{
                token: {
                  fontFamily: '"TT Norms", sans-serif',
                },
              }}
            >
              <RouterProvider router={router} />
            </ConfigProvider>
          </DateProvider>
        </ToastProvider>
      </Provider>
    </StyleProvider>
  </StrictMode>,
);
