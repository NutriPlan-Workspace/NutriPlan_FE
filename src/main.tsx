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

import { ScaleProvider } from './contexts/ScaleContext';
import { ScaleProviderIngre } from './contexts/ScaleIngreContext';
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
            <ScaleProvider>
              <ScaleProviderIngre>
                <ConfigProvider
                  theme={{
                    token: {
                      fontFamily: '"TT Norms", sans-serif',
                      // align Ant Design's default (blue) primary with NutriPlan theme
                      colorPrimary: '#6fb478',
                      colorInfo: '#6fb478',
                      colorLink: '#417d4d',
                    },
                  }}
                >
                  <RouterProvider router={router} />
                </ConfigProvider>
              </ScaleProviderIngre>
            </ScaleProvider>
          </DateProvider>
        </ToastProvider>
      </Provider>
    </StyleProvider>
  </StrictMode>,
);
