import React from 'react';
import {
  RectButtonProps,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

import { Container, Title, Load, TypeProps } from './styles';

interface IProps extends RectButtonProps {
  title: string;
  type?: TypeProps;
  isLoading?: boolean;
}

const Button: React.FC<IProps> = ({
  title,
  type = 'primary',
  isLoading = false,
  ...rest
}) => {
  return (
    <GestureHandlerRootView>
      <Container type={type} enabled={!isLoading} {...rest}>
        {isLoading ? <Load /> : <Title>{title}</Title>}
      </Container>
    </GestureHandlerRootView>
  );
};

export default Button;
