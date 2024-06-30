// src/hooks/useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Aquí deberías verificar el token almacenado en el localStorage o en una cookie
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Decodifica el token para obtener la información del usuario
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUser(decodedToken);
    }
  }, []);

  return { isAuthenticated, user };
};
