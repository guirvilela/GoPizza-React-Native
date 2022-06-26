import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useTheme } from 'styled-components/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Orders from '@screens/OrderReady';
import BottomMenu from '@components/BottomMenu';
import { useAuth } from '@hooks/auth';

import Home from '@screens/Home';
import firestore from '@react-native-firebase/firestore';

const { Navigator, Screen } = createBottomTabNavigator();

export const UserTabRoutes = () => {
  const { COLORS } = useTheme();
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<string>('0');

  useEffect(() => {
    const subscribe = firestore()
      .collection('orders')
      .where('waiter_id', '==', user?.id)
      .where('status', '==', 'Pronto')
      .onSnapshot((querySnapshot) => {
        setNotifications(String(querySnapshot.docs.length));
      });

    return () => subscribe();
  }, []);

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.SECONDARY_900,
        tabBarInactiveTintColor: COLORS.SECONDARY_400,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
        },
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <BottomMenu title="Cardápio" color={color} />
          ),
        }}
      />
      <Screen
        name="orders"
        component={Orders}
        options={{
          tabBarIcon: ({ color }) => (
            <BottomMenu
              title="Pedidos"
              color={color}
              notification={notifications}
            />
          ),
        }}
      />
    </Navigator>
  );
};
