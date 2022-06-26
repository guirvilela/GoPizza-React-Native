import React from 'react';
import { TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Container, Input, Button, InputArea, ButtonClear } from './styles';

interface ISeachProps extends TextInputProps {
  onSearch: () => void;
  onClear: () => void;
}

const Search: React.FC<ISeachProps> = ({ onSearch, onClear, ...rest }) => {
  const { COLORS } = useTheme();

  return (
    <Container>
      <InputArea>
        <Input placeholder="Pesquisar" {...rest} />

        <ButtonClear onPress={onClear}>
          <Feather name="x" size={16} color="#000" />
        </ButtonClear>
      </InputArea>

      <GestureHandlerRootView>
        <Button onPress={onSearch}>
          <Feather name="search" size={16} color={COLORS.TITLE} />
        </Button>
      </GestureHandlerRootView>
    </Container>
  );
};

export default Search;
