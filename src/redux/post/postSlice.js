import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
};

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        updateStock: (state, action) => {
            const { id, amount } = action.payload; // id item dan perubahan stok
            const item = state.posts.find((post) => post._id === id);
            if (item) {
                item.stock += amount;
            }
        },
    },
});

export const { setPosts } = postSlice.actions;
export const selectPosts = (state) => state.posts.posts;
export default postSlice.reducer;
