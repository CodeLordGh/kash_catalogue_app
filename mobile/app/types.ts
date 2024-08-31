
export type RootStackParamList = {
    RegisterScreen: undefined; // or specify params if needed
    Login: undefined;
    BuyerMainScreen: undefined;
    SellerMainScreen: undefined;
    Chat: undefined;
    ProductPage: undefined,
    PaymentConfirmation: { orderId: string; checkoutRequestID: string };
  };

  export type ChatParamList = {
    Chat: {
      currentUser: { id: string; model: string };
      storeId: string;
      buyerId: string
    };
  }