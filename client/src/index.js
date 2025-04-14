import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css'; // Import our global CSS

// Replace with your actual Clerk publishable key
const clerkFrontendApi = 'pk_test_Y3V0ZS1idXp6YXJkLTgzLmNsZXJrLmFjY291bnRzLmRldiQ';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ClerkProvider publishableKey={clerkFrontendApi}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
);
