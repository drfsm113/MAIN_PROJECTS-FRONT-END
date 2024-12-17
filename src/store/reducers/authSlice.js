import { createSlice } from '@reduxjs/toolkit';

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('authState');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('authState', serializedState);
    } catch {
        // Ignore write errors
    }
};

const initialState = loadState() || {
    user: null,
    accessToken: null,
    refreshToken: null,
    userRole: null,
    totalCartCount: 0,
    totalWishlistCount: 0,
    isLoading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTokens: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            saveState(state);
        },
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.userRole = action.payload.userRole;
            saveState(state);
        },
        refreshToken: (state, action) => {
            state.accessToken = action.payload;
            saveState(state);
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.userRole = null;
            state.totalCartCount = 0;
            state.totalWishlistCount = 0;
            localStorage.removeItem('authState');
        },
        setTotalCartCount: (state, action) => {
            state.totalCartCount = action.payload;
            saveState(state);
        },
        setTotalWishlistCount: (state, action) => {
            state.totalWishlistCount = action.payload;
            saveState(state);
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
});

export const {
    setTokens,
    setUser,
    refreshToken,
    logout,
    setTotalCartCount,
    setTotalWishlistCount,
    setLoading,
    setError,
    clearError
} = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => !!state.auth.accessToken;
export const selectUserRole = (state) => state.auth.userRole;
export const selectTotalCartCount = (state) => state.auth.totalCartCount;
export const selectTotalWishlistCount = (state) => state.auth.totalWishlistCount;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;

export default authSlice.reducer;

// // src/store/slices/authSlice.js
// import { createSlice } from '@reduxjs/toolkit';
//
// const loadState = () => {
//     try {
//         const serializedState = localStorage.getItem('authState');
//         if (serializedState === null) {
//             return undefined;
//         }
//         return JSON.parse(serializedState);
//     } catch (err) {
//         return undefined;
//     }
// };
//
// const saveState = (state) => {
//     try {
//         const serializedState = JSON.stringify(state);
//         localStorage.setItem('authState', serializedState);
//     } catch {
//         // Ignore write errors
//     }
// };
//
// const initialState = loadState() || {
//     user: null,
//     accessToken: null,
//     refreshToken: null,
//     userRole: null,
//     isLoading: false,
//     error: null
// };
//
// const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers: {
//         setTokens: (state, action) => {
//             state.accessToken = action.payload.accessToken;
//             state.refreshToken = action.payload.refreshToken;
//             saveState(state);
//         },
//         setUser: (state, action) => {
//             state.user = action.payload.user;
//             state.userRole = action.payload.userRole;
//             saveState(state);
//         },
//         refreshToken: (state, action) => {
//             state.accessToken = action.payload;
//             saveState(state);
//         },
//         logout: (state) => {
//             state.user = null;
//             state.accessToken = null;
//             state.refreshToken = null;
//             state.userRole = null;
//             localStorage.removeItem('authState');
//         },
//         setLoading: (state, action) => {
//             state.isLoading = action.payload;
//         },
//         setError: (state, action) => {
//             state.error = action.payload;
//         },
//         clearError: (state) => {
//             state.error = null;
//         }
//     },
// });
//
// export const {
//     setTokens,
//     setUser,
//     refreshToken,
//     logout,
//     setLoading,
//     setError,
//     clearError
// } = authSlice.actions;
//
// // Selectors
// export const selectUser = (state) => state.auth.user;
// export const selectIsAuthenticated = (state) => !!state.auth.accessToken;
// export const selectUserRole = (state) => state.auth.userRole;
// export const selectIsLoading = (state) => state.auth.isLoading;
// export const selectError = (state) => state.auth.error;
//
// export default authSlice.reducer;
