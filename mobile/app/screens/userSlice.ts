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

export interface Order {
  id: string;
  buyerName: string;
  createdAt: string;
  deliveryAddress: string;
  items: Array<{ name: string; /* other item properties */ }>;
  status: string;
  totalPrice: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  stock: { color: string; qty: number }[];
  sizes: string[];
  images: string[];
  productId: string; // Add this line
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
  orders: Order[];
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
  products: [] as Product[],
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
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
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
    addProduct: (state, action: PayloadAction<Product>) => {
      // Check if the payload is defined and has an _id
      if (action.payload && action.payload._id) {
        state.products.unshift(action.payload);
      } else {
        console.error('Invalid product data:', action.payload);
      }
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p._id !== action.payload);
    },
    updateUserInfo: (state, action: PayloadAction<Partial<UserState>>) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
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
  addProduct,
  updateProduct,
  deleteProduct,
  updateUserInfo,
} = userSlice.actions;
export default userSlice.reducer;
