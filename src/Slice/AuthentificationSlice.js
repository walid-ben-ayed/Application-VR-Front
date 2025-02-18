import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentuser: {
    username: "",
    roles: "",
    token: ""
  },
  loading: false,
  msgError: "",
  success: false
};

const AuthentificationSlice = createSlice({
  name: 'Authentification',
  initialState,
  reducers: {
    Login(state, action) {
      state.currentuser = action.payload;
      state.currentuser.username = action.payload.username;
      state.currentuser.roles = action.payload.roles;
      state.currentuser.token = action.payload.token;
    },
    IsLoading(state) {
      state.loading = true;
    },
    IsError(state, action) {
      state.msgError = action.payload;
      state.loading = false;
    },
    isSuccess(state) {
      state.success = true;
      state.loading = false;
    }
  }
});

export const AuthentificationActions = AuthentificationSlice.actions;
export const reducer = AuthentificationSlice.reducer;
export default AuthentificationSlice.reducer;
