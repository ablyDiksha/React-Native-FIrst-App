import { Product } from '../types/product';

export type RootStackParamList = {
  Signin: undefined;
  Home: undefined;
  ProductDetail: { product: Product };
  Cart: undefined;
  Login: undefined;
  Profile: undefined;
};
