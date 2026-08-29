import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from 'next-themes';
import ErrorBoundary from './components/ErrorBoundary.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <ErrorBoundary>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <App />
        </ThemeProvider>
      </ErrorBoundary>
    </StrictMode>
  </Provider>,
);
