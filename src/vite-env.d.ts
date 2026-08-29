/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import type React from 'react';

declare module '*.jsx' {
  const component: (props: Record<string, unknown>) => React.JSX.Element;
  export default component;
  export const LanguageProvider: (props: {
    children: React.ReactNode;
  }) => React.JSX.Element;
  export const useLanguage: () => {
    language: string;
    setLanguage: (lang: string) => void;
    t: (key: string, values?: Record<string, string | number>) => string;
  };
  export const ThemeProvider: (props: {
    children: React.ReactNode;
  }) => React.JSX.Element;
  export const useTheme: () => {
    isDark: boolean;
    toggleTheme: () => void;
  };
  export const AuthProvider: (props: {
    children: React.ReactNode;
  }) => React.JSX.Element;
  export const useAuth: () => Record<string, unknown>;
}
