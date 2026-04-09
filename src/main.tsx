import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App';
import { GaRouteTracker } from './components/GaRouteTracker';
import { initGa } from './lib/ga';
import './styles.css';
import { QuizProvider } from './state/QuizContext';

initGa();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QuizProvider>
        <GaRouteTracker />
        <App />
        <Analytics />
        <SpeedInsights />
      </QuizProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
