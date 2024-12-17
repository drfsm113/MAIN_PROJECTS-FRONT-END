import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice'
import toastReducer from "./reducers/toastReducer";
import cartReducer from './Slices/CartSlice';
import reviewsReducer from './Slices/reviewsSlice';
import wishlistReducer from './Slices/WishlistSlice';
const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        wishlist:wishlistReducer,
        toast: toastReducer,
        reviews: reviewsReducer, // Reviews reducer
        // Add other reducers here if you have them
    },
    // middleware is automatically set up with thunk included
});

export default store;