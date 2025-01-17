import { createSlice } from "@reduxjs/toolkit";

const isMyFatoorahInitializedSlice=createSlice({
    name:"isMyFatoorahInitialized",
    initialState:{
        isMyFatoorahInitialized:false,
    },
    reducers:{
        setIsMyFatoorahInitialized(state,action){
            state.data=action.payload        
        },
    }

})

export default isMyFatoorahInitializedSlice;
export const isMyFatoorahInitializedActions=isMyFatoorahInitializedSlice.actions;
