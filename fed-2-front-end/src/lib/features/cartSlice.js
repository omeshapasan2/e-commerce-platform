import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => { // Immer
      const newItem = action.payload;
      const foundItem = state.cartItems.find(
        (el) => el.product._id === newItem._id
      );
      if (!foundItem) {
        state.cartItems.push({ product: action.payload, quantity: 1 });
        return;
      }
      foundItem.quantity += 1;
    },
    decrementQuantity: (state, action) => {
      const id = action.payload;
      const foundItem = state.cartItems.find(
        (el) => el.product._id === id
      );
      if (!foundItem) return;
      if (foundItem.quantity === 1) {
        state.cartItems = state.cartItems.filter(
          (el) => el.product._id !== id
        );
        return;
      }
      foundItem.quantity -= 1;
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter(
        (el) => el.product._id !== id
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addToCart, 
  clearCart,
  decrementQuantity,
  removeFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;
