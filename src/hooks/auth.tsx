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
  department: string;
  avatar_url: string;
}

interface SignInCredentials {
  username: string;
  password: string;
}

interface AuthContextData {
  user: User;
  // eslint-disable-next-line no-unused-vars
  signIn(credentials: SignInCredentials): Promise<User>;
  signOut(): void;
  // loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  // const [loading, setLoading] = useState(true);

  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@OPms:token');
    const user = localStorage.getItem('@OPms:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(
    async ({ username, password }: SignInCredentials) => {
      const response = await api.post('sessions', {
        username,
        password,
      });

      const { token, user } = response.data;
      api.defaults.headers.authorization = `Bearer ${token}`;

      localStorage.setItem('@OPms:token', token);
      localStorage.setItem('@OPms:user', JSON.stringify(user));

      setData({ token, user });

      return response.data.user;
    },
    [],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem('@OPms:token');
    localStorage.removeItem('@OPms:user');

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
