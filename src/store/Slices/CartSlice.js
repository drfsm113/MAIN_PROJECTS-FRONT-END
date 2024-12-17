import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../Services/api";
const MIDDILE_BASE_URL = 'api/v1/client';

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
    const response = await api.get(`${MIDDILE_BASE_URL}/carts/my_cart/`);
    return response.data;
});
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ product_slug, product_variant_slug, quantity }) => {
        const payload = {
            quantity,
            ...(product_variant_slug ? { product_variant_slug } : { product_slug }),
        };

        const response = await api.post(`${MIDDILE_BASE_URL}/carts/add_to_cart/`, payload);
        return response.data;
    }
);
// export const addToCart = createAsyncThunk('cart/addToCart', async ({ product_variant_slug, quantity }) => {
//     const response = await api.post(`${MIDDILE_BASE_URL}/carts/add_to_cart/`, { product_variant_slug, quantity });
//     return response.data;
// });

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ slug, quantity }) => {
    const response = await api.put(`${MIDDILE_BASE_URL}/carts/update_cart_item/`, { slug, quantity });
    return response.data;
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (slug) => {
    const response = await api.post(`${MIDDILE_BASE_URL}/carts/remove_from_cart/`, { slug });
    return response.data;
});

export const clearCart = createAsyncThunk('cart/clearCart', async () => {
    const response = await api.post(`${MIDDILE_BASE_URL}/carts/clear_cart/`);
    return response.data;
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalPrice: 0,
        totalItems: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.totalPrice = action.payload.total_price;
                state.totalItems = action.payload.total_items;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.totalPrice = action.payload.total_price;
                state.totalItems = action.payload.total_items;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.totalPrice = action.payload.total_price;
                state.totalItems = action.payload.total_items;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.totalPrice = action.payload.total_price;
                state.totalItems = action.payload.total_items;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.items = [];
                state.totalPrice = 0;
                state.totalItems = 0;
            });
    },
});

export default cartSlice.reducer;
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
//
// const API_BASE_URL = 'http://127.0.0.1:8000/api/v1/client';
//
// export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
//     const response = await axios.get(`${API_BASE_URL}/carts/my_cart/`);
//     return response.data;
// });
//
// export const addToCart = createAsyncThunk('cart/addToCart', async ({ product_variant_slug, quantity }) => {
//     const response = await axios.post(`${API_BASE_URL}/carts/add_to_cart/`, { product_variant_slug, quantity });
//     return response.data;
// });
//
// export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ slug, quantity }) => {
//     const response = await axios.post(`${API_BASE_URL}/carts/update_cart_item/`, { slug, quantity });
//     return response.data;
// });
//
// export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (slug) => {
//     const response = await axios.post(`${API_BASE_URL}/carts/remove_from_cart/`, { slug });
//     return response.data;
// });
//
// export const clearCart = createAsyncThunk('cart/clearCart', async () => {
//     const response = await axios.post(`${API_BASE_URL}/carts/clear_cart/`);
//     return response.data;
// });
//
// const cartSlice = createSlice({
//     name: 'cart',
//     initialState: {
//         items: [],
//         totalPrice: 0,
//         totalItems: 0,
//         loading: false,
//         error: null,
//     },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchCart.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchCart.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.items = action.payload.items;
//                 state.totalPrice = action.payload.total_price;
//                 state.totalItems = action.payload.total_items;
//             })
//             .addCase(fetchCart.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message;
//             })
//             .addCase(addToCart.fulfilled, (state, action) => {
//                 state.items = action.payload.items;
//                 state.totalPrice = action.payload.total_price;
//                 state.totalItems = action.payload.total_items;
//             })
//             .addCase(updateCartItem.fulfilled, (state, action) => {
//                 state.items = action.payload.items;
//                 state.totalPrice = action.payload.total_price;
//                 state.totalItems = action.payload.total_items;
//             })
//             .addCase(removeFromCart.fulfilled, (state, action) => {
//                 state.items = action.payload.items;
//                 state.totalPrice = action.payload.total_price;
//                 state.totalItems = action.payload.total_items;
//             })
//             .addCase(clearCart.fulfilled, (state) => {
//                 state.items = [];
//                 state.totalPrice = 0;
//                 state.totalItems = 0;
//             });
//     },
// });
//
// export default cartSlice.reducer;