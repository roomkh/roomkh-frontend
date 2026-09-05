// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { ToastProvider } from './context/ToastContext';
import AuthProvider from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { FavoritesProvider } from './hooks/useFavorites';
import './index.css';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <LanguageProvider>
            <FavoritesProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </FavoritesProvider>
          </LanguageProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
