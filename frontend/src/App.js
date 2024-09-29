import './App.css';
import {RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./Pages/Root";
import Home from './Pages/Home/Home';
import Stores from './Pages/Stores/Stores';
import SpecialCards from './Pages/SpecialCards/SpecialCards';
import About from './Pages/About/About';
import Login from './Pages/Auth/Login/Login';
import Register from './Pages/Auth/Register/Register';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { getisLoginState, getRoleState, getToken, getUserInfoFromLocalStorage } from './Store/userInfo-actions';
import CustomCards from './Pages/CustomCards/CustomCards';
import Profile from './Pages/Profile/Profile';
import RecipientInformation from './Pages/RecipientInformation/RecipientInformation';
import Payment from './Pages/PayMethods/Payment';
import ForgetPassword from './Components/ForgetPassword/ForgetPassword';
import fetchProfileData from './Store/profileInfo-actions';
import Admin from './Pages/Admin/Admin';
import AccountManageMent from './Pages/Profile/AccountManageMent';
import Help from './Pages/Profile/Help';
import ViewCard from './Pages/ViewCard/ViewCard';
import Analysis from './Pages/Admin/AdminPages/Analysis';
import Colors from './Pages/Admin/AdminPages/Colors';
import Configs from './Pages/Admin/AdminPages/Configs';
import Coupons from './Pages/Admin/AdminPages/Coupons';
import Shapes from './Pages/Admin/AdminPages/Shapes';
import Shops from './Pages/Admin/AdminPages/Shops';
import AdminSpecialCards from './Pages/Admin/AdminPages/AdminSpecialCards';
import Transactions from './Pages/Admin/AdminPages/Transactions';
import Users from './Pages/Admin/AdminPages/Users';
import Wallets from './Pages/Admin/AdminPages/Wallets';
import Error404 from './Pages/Error404/Error404';
import MainError from './Pages/MainError/MainError';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import fetchCartCounter from './Store/cartCounter-actions';
import DetailsAfterBuying from './Pages/DetailsAfterBuying/DetailsAfterBuying';
import Wallet from './Pages/Wallet/Wallet';
import fetchConfigs from './Store/configs-actions';
import Merchant from './Pages/Admin/AdminPages/Merchant';
import MerchantProfile from './Pages/MerchangProfile/MerchantProfile';
import Discount from './Pages/Discount/Discount';
import MerchantAccountSetting from './Pages/MerchangProfile/MerchantAccountSetting';
import AllDiscounts from './Pages/MerchangProfile/AllDiscounts';
import Orders from './Pages/Admin/AdminPages/Orders/Orders';
import ProfileOrders from './Pages/Profile/ProfileOrders/ProfileOrders';
import RecipientViewCard from './Pages/ReceipientViewCard/RecipientViewCard';
import AdminCarts from './Pages/Admin/AdminPages/AdminCarts';
import Discounts from './Pages/Admin/AdminPages/Discounts';
import Designs from './Pages/Admin/AdminPages/Designs';


const router=createBrowserRouter([{
  path:"/",
  element:<Root/>,
  errorElement: <MainError />,
  children:[
    {index:true,element:<Home/>},
    {path:"about",element:<About/>},
    {path:"stores",element:<Stores/>},
    {path:"login",element:<Login/>},
    {path:"forget-password", element: <ForgetPassword /> },
    {path:"register",element:<Register/>},
    {path:"special-cards",element:<SpecialCards/>},
    {path:"custom-cards",element:<CustomCards/>},
    {path:"view-card/:cardId",element:<ProtectedRoute><ViewCard/></ProtectedRoute>},
    {path:"profile/:userId",element:<ProtectedRoute><Profile/></ProtectedRoute>},
    {path:"wallet/:userId",element:<ProtectedRoute><Wallet/></ProtectedRoute>},
    {path:"recipient-information/:cardId",element:<ProtectedRoute><RecipientInformation/></ProtectedRoute>},
    {path:"payment/:type/:cardId/:price",element:<ProtectedRoute><Payment/></ProtectedRoute>},
    {path:"account-setting",element:<ProtectedRoute><AccountManageMent/></ProtectedRoute>},
    {path:"help",element:<ProtectedRoute><Help/></ProtectedRoute>},
    {path:"details-after-buying/:cardPrice",element:<ProtectedRoute><DetailsAfterBuying/></ProtectedRoute>},
    {path:"user-orders",element:<ProtectedRoute><ProfileOrders/></ProtectedRoute>},

    //admin
    {path:"admin/:adminId",element:<ProtectedRoute><Admin/></ProtectedRoute>},
    {path:"admin-anaysis",element:<ProtectedRoute><Analysis/></ProtectedRoute>},
    {path:"admin-colors",element:<ProtectedRoute><Colors/></ProtectedRoute>},
    {path:"admin-configs",element:<ProtectedRoute><Configs/></ProtectedRoute>},
    {path:"admin-coupons",element:<ProtectedRoute><Coupons/></ProtectedRoute>},
    {path:"admin-shapes",element:<ProtectedRoute><Shapes/></ProtectedRoute>},
    {path:"admin-shops",element:<ProtectedRoute><Shops/></ProtectedRoute>},
    {path:"admin-specialCards",element:<ProtectedRoute><AdminSpecialCards/></ProtectedRoute>},
    {path:"admin-transactions",element:<ProtectedRoute><Transactions/></ProtectedRoute>},
    {path:"admin-users",element:<ProtectedRoute><Users/></ProtectedRoute>},
    {path:"admin-wallets",element:<ProtectedRoute><Wallets/></ProtectedRoute>},
    {path:"admin-merchant",element:<ProtectedRoute><Merchant/></ProtectedRoute>},
    {path:"admin-orders",element:<ProtectedRoute><Orders/></ProtectedRoute>},
    {path:"admin-carts",element:<ProtectedRoute><AdminCarts/></ProtectedRoute>},
    {path:"admin-discounts",element:<ProtectedRoute><Discounts/></ProtectedRoute>},
    {path:"admin-designs",element:<ProtectedRoute><Designs/></ProtectedRoute>},

    //merchant
    {path:"merchant/:merchantId",element:<ProtectedRoute><MerchantProfile/></ProtectedRoute>},
    {path:"merchant-setting",element:<ProtectedRoute><MerchantAccountSetting/></ProtectedRoute>},
    {path:"merchant-discounts",element:<ProtectedRoute><AllDiscounts/></ProtectedRoute>},
    {path:"discount/:discountId",element:<ProtectedRoute><Discount/></ProtectedRoute>},
    { path: "*", element: <Error404 /> },

    //recipient
    {path:"gift-card/:cardId",element:<RecipientViewCard/>},

  ]
}])  



function App() {

  const {i18n:control}=useTranslation();
  const dispatch=useDispatch();
  const token = useSelector((state) => state.userInfo.token);
  const role = useSelector((state) => state.userInfo.role);




  useEffect(() => {
    const updateFontFamily = () => {
      if (control.language === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');

      } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');

      }
    };
    
    updateFontFamily();

    control.on('languageChanged', updateFontFamily);

    return () => {
      control.off('languageChanged', updateFontFamily);
    };
  }, [control]);
  

  // get configs from database
  useEffect(() => {
      if(token){
        dispatch(fetchConfigs(token));
      }
  }, [dispatch, token]);

  // get cart Counter from database
  useEffect(() => {
      if(token){
        dispatch(fetchCartCounter(token));
      }
  }, [dispatch, token]);

  // get profile data from database
  useEffect(() => {
      if(token){
        dispatch(fetchProfileData(token));
      }
  }, [dispatch, token,role]);

  // recieve user data from localStorage with login and role states
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("userData"))) {
      dispatch(getUserInfoFromLocalStorage());
    }
    if (JSON.parse(localStorage.getItem("token"))) {
      dispatch(getRoleState());
      dispatch(getToken());
    }
    dispatch(getisLoginState());
  }, [dispatch]);


  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>

    </QueryClientProvider>
  );
}

export default App;
