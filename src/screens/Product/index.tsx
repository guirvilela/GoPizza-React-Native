import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation, useRoute } from '@react-navigation/native';

import { IProductNavigationProps } from '@src/@types/navigation';

import ButtonBack from '@components/ButtonBack';
import Photo from '@components/Photo';
import InputPrice from '@components/InputPrice';
import Input from '@components/Input';
import Button from '@components/Button';

import {
  Container,
  Header,
  Title,
  DeleteLabel,
  Upload,
  PickImageButton,
  Form,
  Label,
  InputGroup,
  InputGroupHeader,
  MaxCharacters,
} from './styles';
import { ProductProps } from '@src/components/ProductCard';

interface PizzaResponse extends ProductProps {
  photo_path: string;
  price_size: {
    p: string;
    m: string;
    g: string;
  };
}

const Product: React.FC = () => {
  const navigation = useNavigation();

  const [image, setImage] = useState<string>('');
  const [photoPath, setPhotoPath] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priceSizeP, setPriceSizeP] = useState<string>('');
  const [priceSizeM, setPriceSizeM] = useState<string>('');
  const [priceSizeG, setPriceSizeG] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const route = useRoute();
  const { id } = route.params as IProductNavigationProps;

  useEffect(() => {
    if (id) {
      setIsLoading(true);

      firestore()
        .collection('pizzas')
        .doc(id)
        .get()
        .then((response) => {
          const product = response.data() as PizzaResponse;

          setImage(product.photo_url);
          setPhotoPath(product.photo_path);
          setName(product.name);
          setDescription(product.description);
          setPriceSizeP(product.price_size.p);
          setPriceSizeM(product.price_size.m);
          setPriceSizeG(product.price_size.g);
          setIsLoading(false);
        });
    }
  }, [id]);

  const handleAddProduct = async (id?: string) => {
    if (!name.trim()) {
      return Alert.alert('Cadastro', 'Informe o nome da Pizza');
    }
    if (!description.trim()) {
      return Alert.alert('Cadastro', 'Informe a descrição da Pizza');
    }
    if (!image) {
      return Alert.alert('Cadastro', 'Selecione a imagem da Pizza');
    }
    if (!priceSizeP.trim() || !priceSizeM.trim() || !priceSizeG.trim()) {
      return Alert.alert(
        'Cadastro',
        'Informe o preço de todos os tamanhos de pizza',
      );
    }
    setIsLoading(true);
    if (!id) {
      const fileName = new Date().getTime();
      const reference = storage().ref(`/pizzas/${fileName}.png`);

      await reference.putFile(image);
      const photo_url = await reference.getDownloadURL();

      firestore()
        .collection('pizzas')
        .add({
          name,
          name_insensitive: name.toLowerCase().trim(),
          description,
          price_size: {
            p: priceSizeP,
            m: priceSizeM,
            g: priceSizeG,
          },
          photo_url,
          photo_path: reference.fullPath,
        })
        .then(() => {
          setIsLoading(false);

          Alert.alert('Cadastro', 'Pizza cadastrada com sucesso', [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('home');
              },
            },
          ]);
        })
        .catch(() => {
          Alert.alert('Cadastro', 'Não foi possível cadastrar a pizza');
          setIsLoading(false);
        });
    } else {
      firestore()
        .collection('pizzas')
        .doc(id)
        .update({
          name,
          name_insensitive: name.toLowerCase().trim(),
          description,
          price_size: {
            p: priceSizeP,
            m: priceSizeM,
            g: priceSizeG,
          },
        })
        .then(() => {
          setIsLoading(false);

          Alert.alert('Atualização', 'Pizza atualizada com sucesso', [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('home');
              },
            },
          ]);
        })
        .catch(() => {
          Alert.alert('Atualização', 'Não foi atualizar cadastrar a pizza');
          setIsLoading(false);
        });
    }
  };

  const handlePickerImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === 'granted') {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
      });

      if (!response.cancelled) {
        setImage(response.uri);
      }
    }
  };

  const handleBackScreens = () => {
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Deletar Pizza',
      'Você tem certeza que deseja deletar essa pizza?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () => {
            firestore()
              .collection('pizzas')
              .doc(id)
              .delete()
              .then(() => {
                storage()
                  .ref(photoPath)
                  .delete()
                  .then(() => {
                    navigation.navigate('home');
                  });
              });
          },
        },
      ],
    );
  };

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <ButtonBack onPress={handleBackScreens} />

          <Title>Cadastrar</Title>
          {id ? (
            <TouchableOpacity onPress={handleDelete}>
              <DeleteLabel>Deletar</DeleteLabel>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 20 }} />
          )}
        </Header>

        <Upload>
          <Photo uri={image} />

          {!id && (
            <PickImageButton
              title="Carregar"
              type="secondary"
              onPress={handlePickerImage}
            />
          )}
        </Upload>

        <Form>
          <KeyboardAvoidingView>
            <InputGroup>
              <Label>Nome</Label>
              <Input onChangeText={setName} value={name} />
            </InputGroup>

            <InputGroup>
              <InputGroupHeader>
                <Label>Descrição</Label>
                <MaxCharacters>
                  {description.length ?? 0} de 60 caracteres
                </MaxCharacters>
              </InputGroupHeader>

              <Input
                multiline
                maxLength={60}
                style={{ height: 80 }}
                onChangeText={setDescription}
                value={description}
              />
            </InputGroup>

            <InputGroup>
              <Label>Tamanhos e preços</Label>

              <InputPrice
                size="P"
                onChangeText={setPriceSizeP}
                value={priceSizeP}
              />
              <InputPrice
                size="M"
                onChangeText={setPriceSizeM}
                value={priceSizeM}
              />
              <InputPrice
                size="G"
                onChangeText={setPriceSizeG}
                value={priceSizeG}
              />
            </InputGroup>
          </KeyboardAvoidingView>

          {!id ? (
            <Button
              title="Cadastrar Pizza"
              isLoading={isLoading}
              onPress={handleAddProduct}
            />
          ) : (
            <Button
              title="Atualizar Pizza"
              isLoading={isLoading}
              onPress={() => handleAddProduct(id)}
            />
          )}
        </Form>
      </ScrollView>
    </Container>
  );
};

export default Product;
