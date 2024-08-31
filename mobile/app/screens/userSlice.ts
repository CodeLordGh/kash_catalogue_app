// slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  User: string;
  userId: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  userAuth: string;
  deliveryAddress: Array<string>;
}

interface Product {
  name: string;
  description: string;
  price: number;
  _id: string;
  stock: Array<{ color: string; qty: number }>;
}

interface UserState {
  chatId: string | Array<string>;
  cartProducts: Array<{ productId: string; quantity: number; color?: string }>;
  catalogProducts: Array<{ _id: string; name: string; price: number }>;
  userInfo: UserInfo;
  shop: {
    businessName: string;
    storeId: string;
  };
  loading: boolean;
  products: Product[];
  orders: [];
}

const initialState: UserState = {
  chatId: [],
  cartProducts: [],
  catalogProducts: [],
  userInfo: {
    userId: "j",
    User: "",
    userAuth: "",
    deliveryAddress: [],
  },
  shop: {
    businessName: "",
    storeId: "",
  },
  loading: false,
  products: [],
  orders: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setChatId: (state, action: PayloadAction<string>) => {
      state.chatId = action.payload;
    },
    setCartProducts: (
      state,
      action: PayloadAction<
        Array<{ productId: string; quantity: number; color?: string }>
      >
    ) => {
      state.cartProducts = action.payload;
    },
    setCatalogProducts: (
      state,
      action: PayloadAction<Array<{ _id: string; name: string; price: number }>>
    ) => {
      state.catalogProducts = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    setShop: (
      state,
      action: PayloadAction<{ businessName: string; storeId: string }>
    ) => {
      state.shop = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setOrders: (state, action: PayloadAction<any>) => {
      state.products = action.payload;
    },
    logoutUser: (state) => {
      state.chatId = [];
      state.cartProducts = [];
      state.catalogProducts = [];
      state.userInfo = {
        userId: "",
        User: "",
        userAuth: "",
        deliveryAddress: [],
      };
      state.shop = {
        businessName: "",
        storeId: "",
      };
      state.loading = false;
      state.products = [];
    },
  },
});

export const {
  setChatId,
  setCartProducts,
  setCatalogProducts,
  setUserInfo,
  setShop,
  setLoading,
  setProducts,
  logoutUser,
  setOrders,
} = userSlice.actions;
export default userSlice.reducer;
