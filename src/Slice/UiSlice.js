import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: false,
  msgError: "",
  success: false,
  msgSuccess: ""
};

const UiSlice = createSlice({
  name: 'Ui',
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.loading = action.payload;
      state.success = false;
      state.error = false;
    },
    setIsError(state, action) {
      state.msgError = action.payload;
      state.loading = false;
      state.success = false;
      state.error = true;
    },
    setIsSuccess(state, action) {
      state.success = true;
      state.loading = false;
      state.msgError = "";
      state.msgSuccess = action.payload;
      state.error = false;
    }
  },
});

export const UiActions = UiSlice.actions;
export const { reducer } = UiSlice;