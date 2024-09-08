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

export const UpdatePassword= async ({formData,token}) => {
  console.log(token)
  try {
     const response = await axios.patch(`${baseServerUrl}users/updateMyPassword`,formData,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
     });

    return response.data;
  } catch (error) {
    console.error(error);
    return error
  }
};

export const updateCard= async ({formData,token,cardId}) => {
  try {
     const response = await axios.patch(`${baseServerUrl}cards/${cardId}`,formData,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
     });

    return response.data;
  } catch (error) {
    console.error(error);
    return error
  }
};

export const getMyCards= async (token) => {
  try {
     const response = await axios.get(`${baseServerUrl}cards`,{
      headers:{Authorization:`Bearer ${token}`}
     });

    return response.data;
  } catch (error) {
    console.error(error);
    return error
  }
};

export const getSpecialCards= async (token) => {
  try {
     const response = await axios.get(`${baseServerUrl}special-cards`,{
      headers:{Authorization:`Bearer ${token}`}
     });

    return response.data;
  } catch (error) {
    console.error(error);
    return error
  }
};
