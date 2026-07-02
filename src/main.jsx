import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import store from './redux/store';
import { ThemeProvider } from './context/ThemeContext';
import './styles/index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>,
);
