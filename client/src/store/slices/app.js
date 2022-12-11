import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    user: null,
    role: null,
    loadingUser: null,
  },
  reducers: {
    setUser (state, action) {
      state.user = action.payload;
    },
    setRole (state, action) {
      state.role = action.payload;
    },
    setLoadingUser (state, action) {
      state.loadingUser = action.payload;
    },
  }
});

export const actions = appSlice.actions;
export default appSlice.reducer;