import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '@hooks/auth';

import { Alert, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import ButtonBack from '@components/ButtonBack';
import RadioButton from '@components/RadioButton';
import Input from '@components/Input';
import Button from '@components/Button';
import PIZZA_SIZES from '@utils/pizzaSizes';
import { IOrderNavigationProps } from '@src/@types/navigation';
import { ProductProps } from '@src/components/ProductCard';

import {
  Container,
  ContainerScroll,
  Header,
  Image,
  Sizes,
  Form,
  Title,
  Label,
  InputGroup,
  FormRow,
  Price,
} from './styles';

interface PizzaResponseProps extends ProductProps {
  price_size: {
    [key: string]: number;
  };
}

const Order: React.FC = () => {
  const { user } = useAuth();

  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as IOrderNavigationProps;

  const [sendingOrder, setSendingOrder] = useState<boolean>(false);
  const [sizeSelected, setSizeSelected] = useState<string>('');
  const [pizza, setPizza] = useState<PizzaResponseProps>(
    {} as PizzaResponseProps,
  );
  const [quantity, setQuantity] = useState(0);
  const [tableNumber, setTableNumber] = useState(0);

  const amount = sizeSelected
    ? pizza.price_size[sizeSelected] * quantity
    : '0,00';

  useEffect(() => {
    if (id) {
      firestore()
        .collection('pizzas')
        .doc(id)
        .get()
        .then((response) => setPizza(response.data() as PizzaResponseProps))
        .catch(() => {
          Alert.alert('Pedido', 'Não foi possível carregar o produto');
        });
    }
  }, [id]);

  const handleOrder = async () => {
    if (!sizeSelected) {
      return Alert.alert('Pedido', 'Selecione o tamanho da pizza');
    }
    if (!tableNumber) {
      return Alert.alert('Pedido', 'Informe o número da mesa');
    }
    if (!quantity) {
      return Alert.alert('Pedido', 'Informe a quantidade');
    }

    setSendingOrder(true);

    firestore()
      .collection('orders')
      .add({
        quantity,
        amount,
        pizza: pizza.name,
        size: sizeSelected,
        table_number: tableNumber,
        status: 'Preparando',
        waiter_id: user?.id,
        image: pizza.photo_url,
      })
      .then(() => navigation.navigate('home'))
      .catch(() => {
        Alert.alert('Pedido', 'Não foi possível realizar o pedido.'),
          setSendingOrder(false);
      });
  };

  const handleBackScreens = () => {
    navigation.goBack();
  };

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ContainerScroll>
        <Header>
          <ButtonBack
            onPress={handleBackScreens}
            style={{ marginBottom: 108 }}
          />
        </Header>
        <Image source={{ uri: pizza.photo_url }} />

        <Form>
          <Title>{pizza.name}</Title>
          <Label>Selecione um tamanho</Label>
          <Sizes>
            {PIZZA_SIZES.map(({ id, name }) => (
              <RadioButton
                key={id}
                title={name}
                selected={sizeSelected === id}
                onPress={() => setSizeSelected(id)}
              />
            ))}
          </Sizes>

          <FormRow>
            <InputGroup>
              <Label>Número da mesa</Label>
              <Input
                keyboardType="numeric"
                onChangeText={(value) => setTableNumber(Number(value))}
              />
            </InputGroup>

            <InputGroup>
              <Label>Quantidade</Label>
              <Input
                keyboardType="numeric"
                onChangeText={(value) => setQuantity(Number(value))}
              />
            </InputGroup>
          </FormRow>
          <Price>Valor de R$ {amount}</Price>
        </Form>
        <Button
          title="Confirmar Pedido"
          isLoading={sendingOrder}
          onPress={handleOrder}
          style={{
            marginHorizontal: 24,
            marginTop: -5,
            marginBottom: 24,
            zIndex: 9,
          }}
        />
      </ContainerScroll>
    </Container>
  );
};

export default Order;
