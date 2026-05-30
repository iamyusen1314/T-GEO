import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ToastProvider } from './components/Toast';
import { PipelineProvider } from './store/PipelineContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <PipelineProvider>
        <App />
      </PipelineProvider>
    </ToastProvider>
  </StrictMode>,
);
