'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api, setUnauthorizedHandler, tokenStorage } from './api';
import type { AuthResponse, User } from './types';

type Status = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  status: Status;
  user: User | null;
  /** Salva o token devolvido por login/cadastro e entra na garagem. */
  signIn: (response: AuthResponse) => void;
  signOut: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<Status>('loading');
  const [user, setUser] = useState<User | null>(null);

  const signOut = useCallback(() => {
    tokenStorage.clear();
    queryClient.clear(); // não deixa dados do usuário anterior em cache
    setUser(null);
    setStatus('unauthenticated');
    router.replace('/login');
  }, [queryClient, router]);

  const signIn = useCallback(
    ({ accessToken, user }: AuthResponse) => {
      tokenStorage.set(accessToken);
      setUser(user);
      setStatus('authenticated');
      router.replace('/veiculos');
    },
    [router],
  );

  // Ao abrir o app, valida o token salvo buscando o perfil
  useEffect(() => {
    if (!tokenStorage.get()) {
      setStatus('unauthenticated');
      return;
    }
    api
      .getProfile()
      .then((profile) => {
        setUser(profile);
        setStatus('authenticated');
      })
      .catch(() => {
        tokenStorage.clear();
        setStatus('unauthenticated');
      });
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(signOut);
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  const value = useMemo(
    () => ({ status, user, signIn, signOut, setUser }),
    [status, user, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro do AuthProvider');
  return context;
}