import React from 'react';
import { Container } from './styles';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';

import { TouchableOpacityProps } from 'react-native';

const ButtonBack: React.FC<TouchableOpacityProps> = ({ ...rest }) => {
  const { COLORS } = useTheme();

  return (
    <Container {...rest}>
      <MaterialIcons name="chevron-left" size={18} color={COLORS.TITLE} />
    </Container>
  );
};

export default ButtonBack;
