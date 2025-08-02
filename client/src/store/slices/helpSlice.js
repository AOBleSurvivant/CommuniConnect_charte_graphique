import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  helpRequests: [],
  loading: false,
  error: null,
  currentHelpRequest: null,
};

const helpSlice = createSlice({
  name: 'help',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentHelpRequest: (state, action) => {
      state.currentHelpRequest = action.payload;
    },
    addHelpRequest: (state, action) => {
      state.helpRequests.unshift(action.payload);
    },
    updateHelpRequest: (state, action) => {
      const index = state.helpRequests.findIndex(request => request._id === action.payload._id);
      if (index !== -1) {
        state.helpRequests[index] = action.payload;
      }
    },
    removeHelpRequest: (state, action) => {
      state.helpRequests = state.helpRequests.filter(request => request._id !== action.payload);
    },
  },
});

export const { clearError, setCurrentHelpRequest, addHelpRequest, updateHelpRequest, removeHelpRequest } = helpSlice.actions;

export default helpSlice.reducer; 