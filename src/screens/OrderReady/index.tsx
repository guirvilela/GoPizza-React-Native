import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@hooks/auth';

import { Alert, FlatList } from 'react-native';
import OrderCard from '@components/OrderCard';
import ItemSeparator from '@components/ItemSeparator';
import firestore from '@react-native-firebase/firestore';

import { Container, Header, Title } from './styles';

export interface IOrdersProps {
  id?: string;
  quantity: number;
  amount: string;
  pizza: string;
  size: string;
  table_number: number;
  status: string;
  waiter_id: number;
  image: string;
}

const OrderReady: React.FC = () => {
  const { user } = useAuth();

  const [order, setOrders] = useState<IOrdersProps[]>([]);

  useFocusEffect(
    useCallback(() => {
      firestore()
        .collection('orders')
        .where('waiter_id', '==', user?.id)
        .onSnapshot((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          }) as IOrdersProps;
          setOrders(data);
        });
    }, []),
  );

  const handlePizzaDelivered = (id: string, pizza: IOrdersProps) => {
    if (pizza.status === 'Preparando') {
      Alert.alert('Pedido', 'Confirmar que a pizza está PRONTA?', [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () => {
            firestore().collection('orders').doc(id).update({
              status: 'Pronto',
            });
          },
        },
      ]);
    } else {
      Alert.alert('Pedido', 'Confirmar que a pizza foi ENTREGUE?', [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () => {
            firestore().collection('orders').doc(id).update({
              status: 'Entregue',
            });
          },
        },
      ]);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Pedidos Realizados</Title>
      </Header>

      <FlatList
        data={order}
        keyExtractor={(item, index) => Number(index)}
        renderItem={({ item, index }) => (
          <OrderCard
            data={item}
            index={index}
            disabled={item.status === 'Entregue'}
            onPress={() => handlePizzaDelivered(item.id, item)}
          />
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 125, paddingHorizontal: 24 }}
        ItemSeparatorComponent={() => <ItemSeparator />}
      />
    </Container>
  );
};

export default OrderReady;
