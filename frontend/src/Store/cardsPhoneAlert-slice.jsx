import { createSlice } from "@reduxjs/toolkit";

const alertSlice = createSlice({
    name: "alert",
    initialState: {
      showAlert: false,
      lastAlertTime: null, // Added to track when the last alert was shown
    },
    reducers: {
      setShowAlert(state, action) {
        state.showAlert = action.payload;
      },
      setLastAlertTime(state, action) {
        state.lastAlertTime = action.payload;
      },
    },
  });
  
  export default alertSlice;
  export const alertActions = alertSlice.actions;
  
