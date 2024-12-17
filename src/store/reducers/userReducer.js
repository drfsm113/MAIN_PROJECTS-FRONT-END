import { createReducer } from '@reduxjs/toolkit';
import { updateUser, clearUser, setUserSlug, setTokens } from '../actions/userActions';

const initialState = {
    user: null,
    userRole: null,
    userSlug: null,
    accessToken: null,
    refreshToken: null,
};

const userReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(updateUser, (state, action) => {
            state.user = action.payload.user;
            state.userRole = action.payload.userRole;
        })
        .addCase(clearUser, (state) => {
            return initialState;
        })
        .addCase(setUserSlug, (state, action) => {
            state.userSlug = action.payload;
        })
        .addCase(setTokens, (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        });
});

export default userReducer;
// ====================================
// import { UPDATE_USER, CLEAR_USER, SET_USER_SLUG } from '../actions/userActions';
//
// const initialState = {
//     user: null,
//     userRole: null,
//     userSlug: null,
// };
//
// const userReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case UPDATE_USER:
//             return {
//                 ...state,
//                 user: action.payload.user,
//                 userRole: action.payload.userRole
//             };
//         case CLEAR_USER:
//             return initialState;
//         case SET_USER_SLUG:
//             return {
//                 ...state,
//                 userSlug: action.payload
//             };
//         default:
//             return state;
//     }
// };
//
// export default userReducer;
// import { UPDATE_USER, CLEAR_USER } from '../actions/userActions';
//
// const initialState = {
//     user: null,
//     userRole: null,
//
// };
//
// const userReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case UPDATE_USER:
//             return {
//                 ...state,
//                 user: action.payload.user,
//                 userRole: action.payload.userRole
//             };
//         case CLEAR_USER:
//             return initialState;
//         default:
//             return state;
//     }
// };
//
// export default userReducer;