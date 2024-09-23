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
    }else {
      response = await axios.post(`${baseServerUrl}auth/${type}`, formData);
    }
    return response;
  } catch (error) {
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
    return error
  }
};

export const getShops= async () => {
  try {
     const response = await axios.get(`${baseServerUrl}shops`);

    return response.data;
  } catch (error) {
    return error
  }
};

export const UpdatePassword= async ({formData,token}) => {
  try {
     const response = await axios.patch(`${baseServerUrl}users/updateMyPassword`,formData,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
     });

    return response.data;
  } catch (error) {
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
    return error
  }
};

export const getCard= async (token,cardId) => {
  try {
     const response = await axios.get(`${baseServerUrl}cards/${cardId}`,{
      headers:{Authorization:`Bearer ${token}`}
     });

    return response.data;
  } catch (error) {
    return error
  }
};

export const viewCard=async (cardId) => {
  try {
     const response = await axios.get(`${baseServerUrl}cards/${cardId}`);

    return response.data;
  } catch (error) {
    return error
  }
};

export const getSpecialCards= async () => {
  try {
     const response = await axios.get(`${baseServerUrl}special-cards`);
    return response.data;
  } catch (error) {
    return error
  }
};

export const getColors= async () => {
  try {
     const response = await axios.get(`${baseServerUrl}colors`);

    return response.data;
  } catch (error) {
    return error
  }
};

export const getMyWallet= async (token) => {
  try {
     const response = await axios.get(`${baseServerUrl}wallets/me`,{
      headers:{Authorization:`Bearer ${token}`}
     });

    return response.data;
  } catch (error) {
    return error
  }
};

export const transferMoney= async ({token,formData}) => {
  try {
     const response = await axios.post(`${baseServerUrl}wallets/transfer`,formData,{
      headers:{Authorization:`Bearer ${token}`}
     });

    return response.data;
  } catch (error) {
    return error
  }
};


export const getPaymentMethods= async (token) => {
  try {
     const response = await axios.get(`${baseServerUrl}payments/payment-methods`,{
      headers:{Authorization:`Bearer ${token}`}
     });

    return response.data;
  } catch (error) {
    return error
  }
};

export const executePayment= async ({token,formData}) => {
  try {
     const response = await axios.post(`${baseServerUrl}payments/execute-payment`,formData,{
      headers:{Authorization:`Bearer ${token}`}
     });

    return response.data;
  } catch (error) {
    return error
  }
};


export const updateMe = async ({ token, formData }) => {
  try {
    const response = await axios.patch(`${baseServerUrl}users/updateMe`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    return error;
  }
};

export const sendVerificationCode = async ({ token, formData }) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_Base_API_URl}users/verify-phone`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    return error;
  }
};


export const getMe= async (token) => {
  try {
     const response = await axios.get(`${baseServerUrl}users/me`,{
      headers:{Authorization:`Bearer ${token}`}
     });

    return response.data;
  } catch (error) {
    return error
  }
};

export const getAllOrders= async ({token}) => {
  try {
     const response = await axios.get(`${baseServerUrl}orders`,{
      headers:{Authorization:`Bearer ${token}`}
     });

    return response.data;
  } catch (error) {
    return error
  }
};


// admin pages


export const controlColors=async ({token,method,formData}) => {
  try {
    let response;
    if(method==="add"){
      response = await axios.post(`${baseServerUrl}colors`,formData,{
        headers:{Authorization:`Bearer ${token}`}
       });
    }
    return response.data;
  } catch (error) {
    return error
  }
};

export const controlShapes=async ({token,formData}) => {
  try {
    const response = await axios.post(`${baseServerUrl}shapes`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return error
  }
};

export const controlShops=async ({token,formData}) => {
  try {
    const response = await axios.post(`${baseServerUrl}shops`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return error
  }
};

export const controlCoupons=async ({token,method,formData,couponId}) => {
  try {
    let response;
    if(method==="add"){
       response = await axios.post(`${baseServerUrl}coupons`,formData,{
        headers:{Authorization:`Bearer ${token}`}
       });
    }else if(method==="update"){
      response = await axios.patch(`${baseServerUrl}coupons/${couponId}`,formData,{
        headers:{Authorization:`Bearer ${token}`}
       });
    }else if(method==="get"){
      response = await axios.get(`${baseServerUrl}coupons`,{
        headers:{Authorization:`Bearer ${token}`}
       });
    }
    return response.data;
  } catch (error) {
    return error
  }
};

export const controlSpecialCards=async ({token,method,formData,cardId}) => {
  try {
    let response;
    if(method==="add"){
       response = await axios.post(`${baseServerUrl}special-cards`,formData,{
        headers:{Authorization:`Bearer ${token}`}
       });
    }else if(method==="update"){
      response = await axios.patch(`${baseServerUrl}special-cards/${cardId}`,formData,{
        headers:{Authorization:`Bearer ${token}`}
    });
      }
    return response.data;
  } catch (error) {
    return error
  }
};

export const addSpecialColorsShape=async ({token,formData}) => {
  try { 
     const response = await axios.put(`${baseServerUrl}special-cards/shapes`,formData,{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return error
  }
};


export const getConfig = async ({ formData, type, token }) => {
  try {
    let response;
    if (type !== "update") {
      response = await axios.get(`${baseServerUrl}configs`);
    } else {
      response = await axios.patch(`${baseServerUrl}configs`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    return response.data;
  } catch (error) {
    return error;
  }
};

export const controlUsers = async ({ formData, type, token, userId }) => {
  try {
    let response;
    if (type === "add") {
      response = await axios.post(`${baseServerUrl}users/admin`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else if (type === "single") {
      response = await axios.get(`${baseServerUrl}users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }else if(type==="merchant"){
      response = await axios.post(`${baseServerUrl}users/merchant`,formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      response = await axios.get(`${baseServerUrl}users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    return response.data;
  } catch (error) {
    return error;
  }
};

export const controlWallets = async ({ formData, type, token, walletId }) => {
  try {
    let response;
    if (type === "add") {
      response = await axios.patch(`${baseServerUrl}wallets`,formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else if (type === "addOne") {
      response = await axios.patch(`${baseServerUrl}wallets/${walletId}`,formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      response = await axios.get(`${baseServerUrl}wallets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    return response;
  } catch (error) {
    return error;
  }
};



export const controlTransactions = async ({type, token }) => {
  try {
    let response;
    if (type === "successTransactions") {
      response = await axios.get(`${baseServerUrl}transactions/total-invoice-success`,{
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      response = await axios.get(`${baseServerUrl}transactions`,{
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    return response.data;
  } catch (error) {
    return error;
  }
};


export const getStatistics = async ({token }) => {
  try {
    const response = await axios.get(`${baseServerUrl}info/statistics`,{
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};



export const addProColor = async ({ token, formData }) => {
  try {
    const response = await axios.post(`${baseServerUrl}pro-colors`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};


// merchant

export const getDiscounts = async ({token }) => {
  try {
    const response = await axios.get(`${baseServerUrl}discount-codes`,{
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
