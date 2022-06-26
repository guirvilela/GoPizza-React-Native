import React from 'react';
import { useTheme } from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import {
  RectButtonProps,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

import {
  Container,
  Content,
  Image,
  Details,
  Name,
  Description,
  Line,
  Identification,
} from './styles';

export type ProductProps = {
  id: string;
  photo_url: string;
  name: string;
  description: string;
};

interface IProductCard extends RectButtonProps {
  data: ProductProps;
}

const ProductCard: React.FC<IProductCard> = ({ data, ...rest }) => {
  const { COLORS } = useTheme();

  return (
    <Container>
      <GestureHandlerRootView>
        <Content {...rest}>
          <Image source={{ uri: data.photo_url }} />

          <Details>
            <Identification>
              <Name>{data.name}</Name>
              <Feather name="chevron-right" size={18} color={COLORS.SHAPE} />
            </Identification>

            <Description>{data.description}</Description>
          </Details>
        </Content>
      </GestureHandlerRootView>

      <Line />
    </Container>
  );
};

export default ProductCard;
