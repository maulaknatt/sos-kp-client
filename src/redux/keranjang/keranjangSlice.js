import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
    loading: false,
    error: null,
    cartCount: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItemToCart: (state, action) => {
            const existingItem = state.cartItems.find(
                (item) => item._id === action.payload._id
            );
            if (existingItem) {
                existingItem.quantity += action.payload.quantity || 1;
            } else {
                state.cartItems.push({
                    ...action.payload,
                    quantity: action.payload.quantity || 1,
                    stock: action.payload.stock ?? 0
                });
            }
        },
        removeItemFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (item) => item._id !== action.payload
            );
        },
        increaseQuantity: (state, action) => {
            const item = state.cartItems.find(
                (item) => item._id === action.payload
            );
            if (item && item.stock > 0) {
                item.quantity += 1;
                item.stock -= 1;
            }
        },
        decreaseQuantity: (state, action) => {
            const item = state.cartItems.find(
                (item) => item._id === action.payload
            );
            if (item && item.quantity > 0) {
                item.quantity -= 1;
                item.stock += 1;
            }
        },
        setCartItems: (state, action) => {
            state.cartItems = action.payload;
        },
        clearCart: (state) => {
            state.cartItems = [];
        },
        setCartError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const selectCartCount = (state) => state.cart.cartItems.length;

export const {
    addItemToCart,
    removeItemFromCart,
    increaseQuantity,
    decreaseQuantity,
    setCartItems,
    clearCart,
    setCartError,
} = cartSlice.actions;

export default cartSlice.reducer;
