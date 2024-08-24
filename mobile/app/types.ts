import { MessageList } from "@/components/Messages";

export type RootStackParamList = {
    RegisterScreen: undefined; // or specify params if needed
    Login: undefined;
    BuyerMainScreen: undefined;
    SellerMainScreen: undefined;
    Chat: undefined;
  };

  export type ChatParamList = {
    Chat: {
      currentUser: { id: string; model: string };
      storeId: string;
      buyerId: string
    };
  }