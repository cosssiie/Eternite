import { StrictMode } from 'react'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { FavouritesProvider } from './context/FavouritesContext';
import { SocketProvider } from './context/SocketContext';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <SocketProvider>
          <FavouritesProvider>
            <App />
          </FavouritesProvider>
        </SocketProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)