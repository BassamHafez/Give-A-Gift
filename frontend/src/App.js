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
import ErrorURL from './Pages/PayMethods/ErrorURL';
import ForgetPassword from './Components/ForgetPassword/ForgetPassword';
import fetchProfileData from './Store/profileInfo-actions';


const router=createBrowserRouter([{
  path:"/",
  element:<Root/>,
  children:[
    {index:true,element:<Home/>},
    {path:"about",element:<About/>},
    {path:"stores",element:<Stores/>},
    {path:"login",element:<Login/>},
    { path: "forget-password", element: <ForgetPassword /> },
    {path:"register",element:<Register/>},
    {path:"special-cards",element:<SpecialCards/>},
    {path:"custom-cards",element:<CustomCards/>},
    {path:"profile/:userId",element:<Profile/>},
    {path:"recipient-information/:cardId",element:<RecipientInformation/>},
    {path:"payment/:type/:userId",element:<Payment/>},
    {path:"payment-faild",element:<ErrorURL/>},
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
        document.documentElement.style.setProperty('--main_font', '"Cairo", sans-serif');
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');

      } else {
        document.documentElement.style.setProperty('--main_font', '"Playfair Display", serif');
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
  

  // get profile data from database
  useEffect(() => {
      if(role!=="admin"&&token){
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
