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
import {ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Docs from './Pages/Admin/AdminPages/Docs';
import StoreProfile from './Pages/Stores/StoreProfile';
import Ads from './Pages/Admin/AdminPages/Ads';
import Slides from './Pages/Admin/AdminPages/Slides';
import JoinUs from './Pages/JoinUs/JoinUs';
import Policy from './Pages/Policy/Policy';
import Categories from './Pages/Admin/AdminPages/Categories';
import AppDesigns from './Pages/Admin/AdminPages/AppDesigns';
import TopShops from './Pages/Admin/AdminPages/TopShops';


const router=createBrowserRouter([{
  path:"/",
  element:<Root/>,
  errorElement: <MainError />,
  children:[
    {index:true,element:<Home/>},
    {path:"about",element:<About/>},
    {path:"stores",element:<Stores/>},
    {path:"store/:storeId",element:<StoreProfile/>},
    {path:"login",element:<Login/>},
    {path:"forget-password", element: <ForgetPassword /> },
    {path:"register",element:<Register/>},
    {path:"special-cards",element:<SpecialCards/>},
    {path:"custom-cards",element:<CustomCards/>},
    {path:"joinUs",element:<JoinUs/>},
    {path:"docs",element:<Docs/>},
    {path:"our-policy",element:<Policy/>},
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
    {path:"admin-app-designs",element:<ProtectedRoute><AppDesigns/></ProtectedRoute>},
    {path:"admin-ads",element:<ProtectedRoute><Ads/></ProtectedRoute>},
    {path:"admin-slides",element:<ProtectedRoute><Slides/></ProtectedRoute>},
    {path:"admin-categories",element:<ProtectedRoute><Categories/></ProtectedRoute>},
    {path:"admin-top-stores",element:<ProtectedRoute><TopShops/></ProtectedRoute>},

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
  let isArLang = localStorage.getItem("i18nextLng") === "ar";


  useEffect(() => {
    const updateFontFamily = () => {
      if (control.language === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
        document.documentElement.style.setProperty('--main_font', '"Cairo", sans-serif');

      } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
        document.documentElement.style.setProperty('--main_font','"Roboto", sans-serif')

      }
    };
    // '"ARAHAMAH1982", sans-serif'
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        className={isArLang?"ar_toast":""}
      />
      <RouterProvider router={router}/>
    </QueryClientProvider>
  );
}

export default App;
