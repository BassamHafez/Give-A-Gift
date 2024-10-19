import { createSlice } from "@reduxjs/toolkit";

const customCardSlice = createSlice({
  name: "customCard",
  initialState: {
    isStoreSelected: false,
    storeId: "",
    storeLogo:""
  },
  reducers:{
    setIsStoreSelected(state,action){
        state.isStoreSelected=action.payload
    },
    setStoreId(state,action){
        state.storeId=action.payload
    },
    setStoreLogo(state,action){
        state.storeLogo=action.payload
    }
  }
});

export default customCardSlice;

export const customCardActions=customCardSlice.actions;