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
import { useDispatch } from "react-redux";
import { getisLoginState, getRoleState, getToken, getUserInfoFromLocalStorage } from './Store/userInfo-actions';
import CustomCards from './Pages/CustomCards/CustomCards';
import Profile from './Pages/Profile/Profile';
import RecipientInformation from './Pages/RecipientInformation/RecipientInformation';


const router=createBrowserRouter([{
  path:"/",
  element:<Root/>,
  children:[
    {index:true,element:<Home/>},
    {path:"about",element:<About/>},
    {path:"stores",element:<Stores/>},
    {path:"login",element:<Login/>},
    {path:"register",element:<Register/>},
    {path:"special-cards",element:<SpecialCards/>},
    {path:"custom-cards",element:<CustomCards/>},
    {path:"profile/:userId",element:<Profile/>},
    {path:"recipient-information/:cardId",element:<RecipientInformation/>},
  ]
}])  



function App() {

  const {i18n:control}=useTranslation();
  const dispatch=useDispatch();

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
