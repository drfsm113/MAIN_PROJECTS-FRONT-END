import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../Services/api";

// Base URL for API requests
const REVIEW_BASE_URL = 'api/v1/client/reviews';

// Async thunk for fetching reviews for a specific product
export const fetchReviews = createAsyncThunk('reviews/fetchReviews', async (productId) => {
    const response = await api.get(`${REVIEW_BASE_URL}/product/${productId}`);
    return response.data; // Assuming API returns reviews for the product
});

// Async thunk for submitting a review
export const submitReview = createAsyncThunk('reviews/submitReview', async ({ productId, reviewData }, thunkAPI) => {
    const formData = new FormData();
    formData.append('product', productId);
    formData.append('rating', reviewData.rating);
    formData.append('title', reviewData.title);
    formData.append('comment', reviewData.comment);
    formData.append('pros', reviewData.pros);
    formData.append('cons', reviewData.cons);

    // Append images if there are any
    reviewData.uploadedImages.forEach(image => {
        formData.append('uploaded_images', image);
    });

    try {
        const response = await api.post(`${REVIEW_BASE_URL}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

// Reviews slice
const reviewsSlice = createSlice({
    name: 'reviews',
    initialState: {
        reviews: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetReviewForm: (state) => {
            // This can be used to reset the review form fields
            state.newReview = { rating: 5, title: '', comment: '', pros: '', cons: '' };
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetch reviews lifecycle
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch reviews';
            })

            // Handle submit review lifecycle
            .addCase(submitReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitReview.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews.unshift(action.payload); // Add the new review to the top
            })
            .addCase(submitReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to submit review';
            });
    },
});

// Export the actions and the reducer
export const { resetReviewForm } = reviewsSlice.actions;
export default reviewsSlice.reducer;
