import axios from "axios";
const baseServerUrl = process.env.REACT_APP_Base_API_URl;

export const signFormsHandler = async ({ type, formData, method }) => {
  try {
    let response = null;
    if (method === "put") {
      response = await axios.put(
        `${baseServerUrl}auth/resetPassword`,
        formData
      );
    } else {
      response = await axios.post(`${baseServerUrl}auth/${type}`, formData);
    }
    return response;
  } catch (error) {
    console.log(error);
    if (error.response) {
      throw error.response;
    } else if (error.request) {
      throw error.request;
    }
    throw error.message;
  }
};


export const getShapes = async () => {
  try {
     const response = await axios.get(`${baseServerUrl}shapes`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getShops= async () => {
  try {
     const response = await axios.get(`${baseServerUrl}shops`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const UpdatePassword= async (formData) => {
  try {
     const response = await axios.patch(`${baseServerUrl}users/updateMyPassword`,formData);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};