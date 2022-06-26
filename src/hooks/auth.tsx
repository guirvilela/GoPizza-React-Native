import React, { createContext, useContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  IAuthContextData,
  IAuthProviderProps,
  IUserData,
} from './types/userTypes';

const USER_COLLECTION = '@gopizza:users';

export const AuthContext = createContext({} as IAuthContextData);

const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [isLogging, setIsLogging] = useState(false);
  const [user, setUser] = useState<IUserData | null>(null);

  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      return Alert.alert('Login', 'Informe o e-mail e a senha');
    }

    setIsLogging(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .then((account) => {
        firestore()
          .collection('users')
          .doc(account.user.uid)
          .get()
          .then(async (profile) => {
            const { name, isAdmin } = profile.data() as IUserData;

            if (profile.exists) {
              const userData = {
                id: account.user.uid,
                name,
                isAdmin,
              };

              await AsyncStorage.setItem(
                USER_COLLECTION,
                JSON.stringify(userData),
              );
              setUser(userData);
            }
          })
          .catch(() =>
            Alert.alert('Login', 'Não foi possível buscar os dados do usuário'),
          );
      })
      .catch((error) => {
        const { code } = error;

        if (code === 'auth/user-not-found' || code === 'auth/wrong-password') {
          return Alert.alert('Login', 'E-mail e/ou senha inválida');
        } else {
          return Alert.alert('Login', 'Não foi possível realizar o login.');
        }
      })
      .finally(() => setIsLogging(false));
  };

  const signOut = async () => {
    await auth().signOut();
    await AsyncStorage.removeItem(USER_COLLECTION);
    setUser(null);
  };

  const loadUserStorageData = async () => {
    setIsLogging(true);

    const storageData = await AsyncStorage.getItem(USER_COLLECTION);

    if (storageData) {
      const userData = JSON.parse(storageData) as IUserData;
      setUser(userData);
    }
    setIsLogging(false);
  };

  const forgotPassword = async (email: string) => {
    if (!email) {
      return Alert.alert('Redefinir senha', 'Informe o e-mail');
    }

    auth()
      .sendPasswordResetEmail(email)
      .then(() =>
        Alert.alert(
          'Redefinir senha',
          'Enviamos um link no seu email para redefinir sua senha',
        ),
      )
      .catch(() =>
        Alert.alert(
          'Redefinir senha',
          'Não foi possível enviar o email para redefinir sua senha',
        ),
      );
  };

  useEffect(() => {
    loadUserStorageData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        forgotPassword,
        isLogging,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};

export { AuthProvider, useAuth };
