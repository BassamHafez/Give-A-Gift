import { createSlice } from "@reduxjs/toolkit";

const configsSlice = createSlice({
  name: "configs",
  initialState: {
    mainColor: "#b62026",
    subColor: "#2D3A58",
    VAT: "15",
    celebrateIconPrice: "5",
    celebrateLinkPrice: "5",
    walletStarting:"0",
    messageReminder:""
  },
  reducers: {
    setMainColor(state, action) {
      state.mainColor = action.payload;
    },
    setSubColor(state, action) {
      state.subColor = action.payload;
    },
    setVAT(state, action) {
      state.VAT = action.payload;
    },
    setCelebrateIconPrice(state, action) {
      state.celebrateIconPrice = action.payload;
    },
    setCelebrateLinkPrice(state, action) {
      state.celebrateLinkPrice = action.payload;
    },
    setWalletStarting(state, action) {
      state.walletStarting = action.payload;
    },
    setCashBack(state, action) {
      state.cashBack = action.payload;
    },
    setMessageReminer(state, action) {
      state.messageReminder = action.payload;
    },
  },
});

export default configsSlice;
export const configActions = configsSlice.actions;
