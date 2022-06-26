import React from 'react';
import { View } from 'react-native';

import { Image, Placeholder, PlaceholderTitle } from './styles';

interface IPhotoProps {
  uri: string | null;
}

const Photo: React.FC<IPhotoProps> = ({ uri }) => {
  return (
    <>
      {uri ? (
        <Image source={{ uri }} />
      ) : (
        <Placeholder>
          <PlaceholderTitle>Nenhuma foto{'\n'} carregada</PlaceholderTitle>
        </Placeholder>
      )}
    </>
  );
};

export default Photo;
