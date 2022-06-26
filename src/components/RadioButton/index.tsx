import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import {
  Container,
  Title,
  RadioContainer,
  RadioSelected,
  IRadioButtonProps,
} from './styles';

interface IRadioButton extends TouchableOpacityProps, IRadioButtonProps {
  title: string;
}

const RadioButton: React.FC<IRadioButton> = ({
  title,
  selected = false,
  ...rest
}) => {
  return (
    <Container selected={selected} {...rest}>
      <RadioContainer>{selected && <RadioSelected />}</RadioContainer>
      <Title>{title}</Title>
    </Container>
  );
};

export default RadioButton;
