export interface IProductNavigationProps {
  id?: string;
}

export interface IOrderNavigationProps {
  id: string;
}

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      home: undefined;
      product: IProductNavigationProps;
      order: IOrderNavigationProps;
      orders: undefined;
    }
  }
}
