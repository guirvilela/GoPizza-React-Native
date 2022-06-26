import React, { useState } from 'react';
import Input from '@components/Input';
import Button from '@components/Button';
import { KeyboardAvoidingView, Platform } from 'react-native';

import { useAuth } from '@hooks/auth';

import brandImg from '@assets/brand.png';
import {
  Container,
  Content,
  Title,
  Brand,
  ForgotPasswordButton,
  ForgotPasswordLabel,
} from './styles';

const SignIn: React.FC = () => {
  const { signIn, isLogging, forgotPassword } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSignIn = () => {
    signIn(email, password);
  };

  const handleForgotPassword = () => {
    forgotPassword(email);
  };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Content>
          <Brand source={brandImg} />
          <Title>Login</Title>

          <Input
            placeholder="E-mail"
            type="secondary"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={setEmail}
          />

          <Input
            placeholder="Senha"
            type="secondary"
            secureTextEntry
            onChangeText={setPassword}
          />

          <ForgotPasswordButton onPress={handleForgotPassword}>
            <ForgotPasswordLabel>Esqueci minha senha</ForgotPasswordLabel>
          </ForgotPasswordButton>

          <Button
            title="Entrar"
            type="secondary"
            isLoading={isLogging}
            onPress={handleSignIn}
          />
        </Content>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default SignIn;
