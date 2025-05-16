import React, { createContext, useContext, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  role: string | null;
}

interface UserCredentials {
  email: string;
  senha: string;
}

interface AuthContextType {
  auth: AuthState;
  login: (credentials: UserCredentials) => Promise<boolean>;
  logout: () => void;
  register: (email: string, senha: string, role: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const role =
          decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
        const email =
          decoded.email ||
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
          null;

        return {
          isAuthenticated: true,
          email,
          role,
        };
      } catch {
        localStorage.removeItem('token');
      }
    }
    return {
      isAuthenticated: false,
      email: null,
      role: null,
    };
  });

  const login = async (credentials: UserCredentials): Promise<boolean> => {
    try {
      const response = await fetch('https://backend-2dud.onrender.com/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/plain',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) return false;

      const responseBody = await response.text();
      const parsed = JSON.parse(responseBody);
      const token = parsed.token;

      localStorage.setItem('token', token);

      const decoded: any = jwtDecode(token);
      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
      const email =
        decoded.email ||
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
        null;

      setAuth({
        isAuthenticated: true,
        email,
        role,
      });

      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({
      isAuthenticated: false,
      email: null,
      role: null,
    });
  };

  
  const register = async (email: string, senha: string, role: string): Promise<boolean> => {
    try {
      const response = await fetch('https://backend-2dud.onrender.com/api/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
        body: JSON.stringify({ email, senha, role }),
      });

      if (!response.ok) throw new Error('Erro no registro');

      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
