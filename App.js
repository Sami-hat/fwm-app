import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Tabs } from './components/Tabs';

export default function App() {
  return (
    <AuthProvider>
      <Tabs />
    </AuthProvider>
  );
}