import React, { useState, useCallback } from 'react';
import { useTheme } from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as reactNative from 'react-native';
import Search from '@components/Search';
import ProductCard, { ProductProps } from '@components/ProductCard';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@hooks/auth';

import happyEmoji from '@assets/happy.png';

import {
  Container,
  Header,
  Greeting,
  GreetingEmoji,
  GreetingText,
  MenuHeader,
  MenuItemsNumber,
  Title,
  NewProductButton,
} from './styles';

const Home: React.FC = () => {
  const { user, signOut } = useAuth();
  const { COLORS } = useTheme();
  const navigation = useNavigation();
  const [pizzas, setPizzas] = useState<ProductProps[]>([]);
  const [search, setSearch] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      getAllPizzas('');
    }, []),
  );

  const getAllPizzas = (value: string) => {
    const formattedValue = value.toLocaleLowerCase().trim();

    firestore()
      .collection('pizzas')
      .orderBy('name_insensitive')
      .startAt(formattedValue)
      .endAt(`${formattedValue}\uf8ff`)
      .get()
      .then((response) => {
        const data = response.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        }) as ProductProps[];

        setPizzas(data);
      })
      .catch(() =>
        reactNative.Alert.alert(
          'Consulta',
          'Não foi possível realizar a consulta',
        ),
      );
  };

  const handleSearch = () => {
    getAllPizzas(search);
  };

  const handleSearchClear = () => {
    setSearch('');
    getAllPizzas('');
  };

  const handleOpen = (id: string) => {
    const route = user?.isAdmin ? 'product' : 'order';
    navigation.navigate(route, { id });
  };

  const handleAdd = () => {
    navigation.navigate('product', {});
  };

  return (
    <Container>
      <Header>
        <Greeting>
          <GreetingEmoji source={happyEmoji} />
          <GreetingText>Olá, {user.name}</GreetingText>
        </Greeting>

        <reactNative.TouchableOpacity>
          <MaterialIcons
            name="logout"
            color={COLORS.TITLE}
            size={24}
            onPress={signOut}
          />
        </reactNative.TouchableOpacity>
      </Header>

      <Search
        onChangeText={setSearch}
        value={search}
        onSearch={handleSearch}
        onClear={handleSearchClear}
      />

      <MenuHeader>
        <Title>Cardápio</Title>
        {pizzas.length > 0 ? (
          <MenuItemsNumber>
            {pizzas.length} pizza{pizzas.length > 1 && 's'}
          </MenuItemsNumber>
        ) : (
          <MenuItemsNumber>Nenhuma pizza cadastrada</MenuItemsNumber>
        )}
      </MenuHeader>

      <reactNative.FlatList
        data={pizzas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard data={item} onPress={() => handleOpen(item.id)} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 15,
          marginHorizontal: 24,
        }}
      />

      {user?.isAdmin && (
        <NewProductButton
          title="Cadastrar Pizza"
          type="secondary"
          onPress={handleAdd}
        />
      )}
    </Container>
  );
};

export default Home;
