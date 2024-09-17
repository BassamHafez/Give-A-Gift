import axios from "axios";
import { profileActions } from "./profileInfo-slice";
const baseServerUrl = process.env.REACT_APP_Base_API_URl;

const fetchProfileData = (token) => {
  console.log("hi")
  return async (dispatch) => {
      try {
        const response = await axios.get(`${baseServerUrl}users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const res = response.data;
        dispatch(profileActions.setProfileInfo(res.data));
        return response.data;
      } catch (error) {
        console.error(error);
        return error;
      }
  };
};

export default fetchProfileData;
