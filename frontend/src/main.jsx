import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from 'next-themes';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <App />
      </ThemeProvider>
    </StrictMode>
  </Provider>,
);
