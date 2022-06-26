import { ReactNode } from 'react';

export interface IUserData {
  id: string;
  name: string;
  isAdmin: boolean;
}

export interface IAuthContextData {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  isLogging: boolean;
  user: IUserData | null;
}

export interface IAuthProviderProps {
  children: ReactNode;
}
