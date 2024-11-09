import { createSlice } from '@reduxjs/toolkit';

const showLanguageIconSlice=createSlice({
    name:'showLanguageIcon',
    initialState:{
        showIcon:false
    },
    reducers:{
        setShowIcon(state,action){
            state.showIcon=action.payload;
        }
    }
})

export default showLanguageIconSlice;
export const showIconActions=showLanguageIconSlice.actions;