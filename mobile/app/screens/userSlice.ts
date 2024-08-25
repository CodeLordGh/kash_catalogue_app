// slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserInfo {
  buyerId: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

interface UserState {
  chatId: string;
  cartProducts: Array<{ productId: string; quantity: number; color?: string }>;
  catalogProducts: Array<{ _id: string; name: string; price: number }>;
  userInfo: UserInfo;
  shop: {
    businessName: string;
    storeId: string;
  };
}

const initialState: UserState = {
  chatId: '',
  cartProducts: [],
  catalogProducts: [],
  userInfo: {
    buyerId: '',
  },
  shop: {
    businessName: '',
    storeId: '',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setChatId: (state, action: PayloadAction<string>) => {
      state.chatId = action.payload;
    },
    setCartProducts: (state, action: PayloadAction<Array<{ productId: string; quantity: number; color?: string }>>) => {
      state.cartProducts = action.payload;
    },
    setCatalogProducts: (state, action: PayloadAction<Array<{ _id: string; name: string; price: number }>>) => {
      state.catalogProducts = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    setShop: (state, action: PayloadAction<{ businessName: string; storeId: string }>) => {
      state.shop = action.payload;
    },
  },
});

export const { setChatId, setCartProducts, setCatalogProducts, setUserInfo, setShop } = userSlice.actions;
export default userSlice.reducer;