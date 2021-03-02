import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface AuthState {
  token: string;
  user: User;
}

interface User {
  id: string;
  name: string;
  username: string;
  role: string;
  avatar_url: string;
}

interface SignInCredentials {
  username: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  // loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  // const [loading, setLoading] = useState(true);

  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Logen:token');
    const user = localStorage.getItem('@Logen:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ username, password }) => {
    const response = await api.post('sessions', {
      username,
      password,
    });

    const { token, user } = response.data;
    api.defaults.headers.authorization = `Bearer ${token}`;

    localStorage.setItem('@Logen:token', token);
    localStorage.setItem('@Logen:user', JSON.stringify(user));

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@Logen:token');
    localStorage.removeItem('@Logen:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within as AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
