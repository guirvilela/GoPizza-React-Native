import React from 'react';
import { TextInputProps } from 'react-native';

import { Container, Size, Label, Input } from './styles';

interface InputPriceProps extends TextInputProps {
  size: string;
}

const InputPrice: React.FC<InputPriceProps> = ({ size, ...rest }) => {
  return (
    <Container>
      <Size>
        <Label>{size}</Label>
      </Size>

      <Label>R$</Label>

      <Input keyboardType="numeric" {...rest} />
    </Container>
  );
};

export default InputPrice;
