import { IOrdersProps } from '@src/screens/OrderReady';
import React from 'react';
import { View } from 'react-native';
import { TouchableOpacityProps } from 'react-native';

import {
  Container,
  Image,
  Name,
  Description,
  StatusContainer,
  StatusLabel,
} from './styles';

interface IOrderCard extends TouchableOpacityProps {
  index: number;
  data: IOrdersProps;
}

const OrderCard: React.FC<IOrderCard> = ({ index, data, ...rest }) => {
  return (
    <Container index={index} {...rest}>
      <Image source={{ uri: data.image }} />
      <Name>{data.pizza}</Name>
      <Description>
        Mesa {data.table_number} • Qtd: {data.quantity}
      </Description>

      <StatusContainer status={data?.status}>
        <StatusLabel status={data?.status}>{data.status}</StatusLabel>
      </StatusContainer>
    </Container>
  );
};

export default OrderCard;
