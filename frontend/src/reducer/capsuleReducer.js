import { createSlice } from "@reduxjs/toolkit";

export const capsuleReducer = createSlice({
    name: "capsule",
    initialState: {
        capsule: {},
        loading: false,
        recieved: null,
        error: null,
    },
    reducers: {
        BREW_CAPSULE_REQUEST: (state) => {
            state.loading = true;
            state.error = null;
        },
        BREW_CAPSULE_SUCCESS: (state, action) => {
            state.loading = false;
            state.recieved = true,
                state.capsule = action.payload;
            state.error = null;
        },
        BREW_CAPSULE_FAIL: (state, action) => {
            state.loading = false;
            state.recieved = false,
                state.capsule = null;
            state.error = action.payload;
        },
        GET_USER_CAPSULE_REQUEST: (state) => {
            state.loading = true;
            state.error = null;
        },
        GET_USER_CAPSULE_SUCCESS: (state, action) => {
            state.loading = false;
            state.recieved = true,
                state.capsule = action.payload;
            state.error = null;
        },
        GET_USER_CAPSULE_FAIL: (state, action) => {
            state.loading = false;
            state.recieved = false,
                state.capsule = null;
            state.error = action.payload;
        },
        UPDATE_USER_CAPSULE_STATUS_REQUEST: (state) => {
            state.loading = true;
            state.error = null;
        },
        UPDATE_USER_CAPSULE_STATUS_SUCCESS: (state, action) => {
            state.loading = false;
            state.error = null;
        },
        UPDATE_USER_CAPSULE_STATUS_FAIL: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        CLEAR_ERRORS: (state) => {
            state.error = null;
            state.recieved = null;
        },
    }
});

export const {
    BREW_CAPSULE_REQUEST,
    BREW_CAPSULE_SUCCESS,
    BREW_CAPSULE_FAIL,
    GET_USER_CAPSULE_REQUEST,
    GET_USER_CAPSULE_SUCCESS,
    GET_USER_CAPSULE_FAIL,
    UPDATE_USER_CAPSULE_STATUS_REQUEST,
    UPDATE_USER_CAPSULE_STATUS_SUCCESS,
    UPDATE_USER_CAPSULE_STATUS_FAIL,
    CLEAR_ERRORS,
} = capsuleReducer.actions;