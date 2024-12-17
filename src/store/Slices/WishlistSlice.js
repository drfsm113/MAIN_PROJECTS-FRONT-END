
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../Services/api";

const MIDDLE_BASE_URL = 'api/v1/client';

// Fetch wishlist items
export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async () => {
    const response = await api.get(`${MIDDLE_BASE_URL}/wishlists/`);
    return response.data;
});
// Fetch wishlist items
export const fetchItemsWishlist = createAsyncThunk('wishlist/fetchWishlist', async () => {
    const response = await api.get(`${MIDDLE_BASE_URL}/wishlists/`);
    return response.data;
});

// Toggle wishlist item
export const toggleWishlistItem = createAsyncThunk(
    'wishlist/toggleItem',
    async ({ product_slug, variant_slug }) => {
        const payload = {
            product_slug,
            ...(variant_slug && { variant_slug }),
        };
        const response = await api.post(`${MIDDLE_BASE_URL}/wishlists/toggle_item/`, payload);
        return response.data;
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [],  // Wishlist items
        totalItems: 0,  // Total number of items in the wishlist
        loading: false,  // Loading state
        error: null,  // Error state
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items || [];
                state.totalItems = (action.payload.items || []).length;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(toggleWishlistItem.fulfilled, (state, action) => {
                const { product_slug, variant_slug } = action.meta.arg;
                const { is_in_wishlist } = action.payload;

                const itemIndex = state.items.findIndex(item =>
                    item.product?.slug === product_slug &&
                    (!variant_slug || item.variant?.slug === variant_slug)
                );

                if (is_in_wishlist) {
                    // If the item is not already in the wishlist, add it
                    if (itemIndex === -1) {
                        state.items.push({
                            product: { slug: product_slug },
                            variant: variant_slug ? { slug: variant_slug } : null
                        });
                        state.totalItems++;
                    }
                } else {
                    // If the item is in the wishlist, remove it
                    if (itemIndex > -1) {
                        state.items.splice(itemIndex, 1);
                        state.totalItems--;
                    }
                }
            })
            .addCase(toggleWishlistItem.rejected, (state, action) => {
                state.error = action.error.message;
            });
    },
});

export default wishlistSlice.reducer;
//========
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from "../../Services/api";
//
// const MIDDLE_BASE_URL = 'api/v1/client';
//
// export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async () => {
//     const response = await api.get(`${MIDDLE_BASE_URL}/wishlists/`);
//     return response.data;
// });
//
//
// export const toggleWishlistItem = createAsyncThunk(
//     'wishlist/toggleItem',
//     async ({ product_slug, variant_slug }) => {
//         const payload = {
//             product_slug,
//             ...(variant_slug && { variant_slug }),
//         };
//         const response = await api.post(`${MIDDLE_BASE_URL}/wishlists/toggle_item/`, payload);
//         return response.data;
//     }
// );
//
// const wishlistSlice = createSlice({
//     name: 'wishlist',
//     initialState: {
//         items: [],
//         totalItems: 0,
//         loading: false,
//         error: null,
//     },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchWishlist.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchWishlist.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.items = action.payload[0]?.items || [];
//                 state.totalItems = state.items.length;
//             })
//             .addCase(fetchWishlist.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message;
//             })
//             .addCase(toggleWishlistItem.fulfilled, (state, action) => {
//                 const { product_slug, variant_slug } = action.meta.arg;
//                 const { is_in_wishlist, item } = action.payload;
//
//                 if (is_in_wishlist) {
//                     state.items.push(item);
//                 } else {
//                     state.items = state.items.filter(wishlistItem =>
//                         wishlistItem?.slug !== product_slug &&
//                         (!variant_slug || wishlistItem?.variant_slug !== variant_slug)
//                     );
//                 }
//                 state.totalItems = state.items.length;
//             })
//             .addCase(toggleWishlistItem.rejected, (state, action) => {
//                 state.error = action.error.message;
//             });
//     },
// });
//
// export default wishlistSlice.reducer;