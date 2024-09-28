import axios from "axios";
import { cartActions } from "./cartCounter-slice";
const baseServerUrl = process.env.REACT_APP_Base_API_URl;

const fetchCartCounter = (token) => {
  return async (dispatch) => {
      try {
        const response = await axios.get(`${baseServerUrl}cards`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const res = response.data;
        let notPaid=[];
        notPaid=res.data?.filter((cart)=>cart.isPaid===false)
        dispatch(cartActions.setCounter(notPaid.length));
      } catch (error) {
      }
  };
};

export default fetchCartCounter;
