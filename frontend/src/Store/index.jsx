import { configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "./userInfo-slice";
import profileSlice from "./profileInfo-slice";
import cartSlice from "./cartCounter-slice";


const store = configureStore({
  reducer: {
    userInfo: userInfoSlice.reducer,
    profileInfo:profileSlice.reducer,
    cartCounter:cartSlice.reducer,
  },
});

export default store;
