// storeStatusSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: false, // Default status
};

const storeStatusSlice = createSlice({
    name: 'storeStatus',
    initialState,
    reducers: {
        setStoreStatus: (state, action) => {
            state.isOpen = action.payload;
        },
    },
});

export const { setStoreStatus } = storeStatusSlice.actions;
export default storeStatusSlice.reducer;
