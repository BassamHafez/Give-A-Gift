import { configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "./userInfo-slice";


const store = configureStore({
  reducer: {
    userInfo: userInfoSlice.reducer,
  },
});

export default store;
