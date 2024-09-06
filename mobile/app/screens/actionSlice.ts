import { createSlice } from '@reduxjs/toolkit';

interface CartItem {
    id: string;
    name: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
  }

const initialState = {
  selectedColor: '',
  selectedSize: '',
  quantity: 1,
  cart: [{
    id: "",
    quantity: 0,
  name: '',
  color: '',
  size: '',
  price: '0',
  index: ''
  }],
  selectedProduct: {
    _id: '',
    updatedAt: '',
    name: '',
    price: 0,
    sizes: [],
    stock: [{
      color: '',
      qty: 0
    }],
    images: []
  }
};

const actionSlice = createSlice({
  name: 'action',
  initialState,
  reducers: {
    setSelectedColor: (state, action) => {
      state.selectedColor = action.payload;
      // Reset quantity when color changes
      state.quantity = 1;
    },
    setSelectedSize: (state, action) => {
      state.selectedSize = action.payload;
    },
    incrementQuantity: (state) => {
      const selectedColorStock = state.selectedProduct.stock.find(c => c.color === state.selectedColor)?.qty ?? 0;
      if (state.quantity < selectedColorStock) {
        state.quantity += 1;
      }
    },
    decrementQuantity: (state) => {
      if (state.quantity > 1) {
        state.quantity -= 1;
      }
    },
    addToCart: (state) => {
      const newItem = {
        id: state.selectedProduct._id,
        name: state.selectedProduct.name,
        color: state.selectedColor,
        size: state.selectedSize,
        quantity: state.quantity,
        price: state.selectedProduct.price,
      };
      
      const existingItemIndex = state.cart.findIndex(
        (item:any) => item.id === newItem.id && item.color === newItem.color && item.size === newItem.size
      );

      if (existingItemIndex !== -1) {
        // If item already exists in cart, update quantity
        (state.cart[existingItemIndex] as any).quantity += newItem.quantity;
      } else {
        // If item doesn't exist, add new item to cart
        (state.cart as unknown as CartItem[]).push(newItem);
      }

      // Update product color quantity
      const colorIndex = state.selectedProduct.stock.findIndex(c => c.color === state.selectedColor);
      state.selectedProduct.stock[colorIndex].qty -= state.quantity;

      // Reset quantity after adding to cart
      state.quantity = 1;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    clearCart: (state) => {
      state.cart = [];
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => `${item.name}-${item.color}-${item.size}` !== action.payload);
    },
    updateCartItemQuantity: (state, action) => {
      const { cartItemId, quantity } = action.payload;
      const item = state.cart.find(item => `${item.name}-${item.color}-${item.size}` === cartItemId);
      if (item && item.quantity) {
        item.quantity = quantity;
      }
    },
  },
});

export const { 
  setSelectedColor, 
  setSelectedSize, 
  incrementQuantity, 
  decrementQuantity, 
  addToCart,
  setSelectedProduct,
  clearCart,
  removeFromCart,
  updateCartItemQuantity
} = actionSlice.actions;

export default actionSlice.reducer;