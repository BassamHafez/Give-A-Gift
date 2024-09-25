import axios from "axios";
import { configActions } from "./configs-slice";
const baseServerUrl = process.env.REACT_APP_Base_API_URl;


const findConfigByKey = (arr, targetKey) => {
    return Array.isArray(arr) ? arr.find(config => config.key === targetKey) : undefined;
  };

const fetchConfigs = (token) => {
  return async (dispatch) => {
      try {
        const response = await axios.get(`${baseServerUrl}configs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const res = response.data;

        dispatch(configActions.setMainColor(findConfigByKey(res?.data, "MAIN_COLOR")?.value));
        dispatch(configActions.setSubColor(findConfigByKey(res?.data, "SECONDRY_COLOR")?.value));
        dispatch(configActions.setVAT(findConfigByKey(res?.data, "VAT_VALUE")?.value));
        dispatch(configActions.setCelebrateIconPrice(findConfigByKey(res?.data, "CELEBRATE_ICON_PRICE")?.value));
        dispatch(configActions.setCelebrateLinkPrice(findConfigByKey(res?.data, "CELEBRATE_LINK_PRICE")?.value));
        dispatch(configActions.setWalletStarting(findConfigByKey(res?.data, "WALLET_STARTING_BALANCE")?.value));
        dispatch(configActions.setCashBack(findConfigByKey(res?.data, "CASH_BACK_PERCENTAGE")?.value));
      } catch (error) {
        console.error(error);
      }
  };
};

export default fetchConfigs;
