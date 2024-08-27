// slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserInfo {
  User: string;
  userId: string;
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
  loading: boolean;
}

const initialState: UserState = {
  chatId: '',
  cartProducts: [],
  catalogProducts: [],
  userInfo: {
    userId: '',
    User: '',
  },
  shop: {
    businessName: '',
    storeId: '',
  },
  loading: false
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    }
  },
});

export const { setChatId, setCartProducts, setCatalogProducts, setUserInfo, setShop, setLoading } = userSlice.actions;
export default userSlice.reducer;