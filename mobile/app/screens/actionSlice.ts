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
  product: {
    _id: 'nike-air-max-2022',
    name: 'Nike Air MAX 2022',
    price: 690.00,
    colors: [
      { name: 'blue', quantity: 5 },
      { name: 'black', quantity: 10 },
      { name: 'yellow', quantity: 3 },
    ],
    sizes: ['32', '40', '42', '44'],
  },
  selectedColor: 'black',
  selectedSize: '40',
  quantity: 1,
  cart: [],
  selectedProduct: {
    _id: '',
    name: '',
    price: 0,
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
      const selectedColorStock = state.product.colors.find(c => c.name === state.selectedColor)?.quantity ?? 0;
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
        (state.cart as CartItem[]).push(newItem);
      }

      // Update product color quantity
      const colorIndex = state.product.colors.findIndex(c => c.name === state.selectedColor);
      state.product.colors[colorIndex].quantity -= state.quantity;

      // Reset quantity after adding to cart
      state.quantity = 1;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    }
  },
});

export const { 
  setSelectedColor, 
  setSelectedSize, 
  incrementQuantity, 
  decrementQuantity, 
  addToCart,
  setSelectedProduct
} = actionSlice.actions;

export default actionSlice.reducer;