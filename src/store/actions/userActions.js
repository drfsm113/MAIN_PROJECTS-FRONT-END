import { createAction } from '@reduxjs/toolkit';

export const updateUser = createAction('user/updateUser');
export const clearUser = createAction('user/clearUser');
export const setUserSlug = createAction('user/setUserSlug');
export const setTokens = createAction('user/setTokens');
// export const UPDATE_USER = 'UPDATE_USER';
// export const CLEAR_USER = 'CLEAR_USER';
// export const SET_USER_SLUG = 'SET_USER_SLUG';
//
// export const updateUser = (userData) => ({
//     type: UPDATE_USER,
//     payload: userData
// });
//
// export const clearUser = () => ({
//     type: CLEAR_USER
// });
//
// export const setUserSlug = (slug) => ({
//     type: SET_USER_SLUG,
//     payload: slug
// });
