import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    counter: 0,
  },
  reducers: {
    setCounter(state, action) {
      state.counter = action.payload;
    },
    addItem(state) {
      state.counter += 1;
    },
    removeItem(state) {
      if (state.counter > 0) {
        state.counter -= 1;
      }
    },
  },
});

export default cartSlice;
export const cartActions = cartSlice.actions;
