export type RootStackParamList = {
    RegisterScreen: undefined; // or specify params if needed
    Login: undefined;
    BuyerMainScreen: { userData: any };
    SellerMainScreen: { userData: any };
    Chat: undefined;
    ProductPage: undefined,
    PaymentConfirmation: {
      orderId: string;
      paymentRequestId: string;
    };
  };

  export type ChatParamList = {
    Chat: {
      currentUser: { id: string; model: string };
      storeId: string;
      buyerId: string
    };
  }
