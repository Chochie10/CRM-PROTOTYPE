import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/authContext';
import AppNavigation from './navigation/Navigation';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppNavigation />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;