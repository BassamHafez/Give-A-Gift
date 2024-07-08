import './App.css';
import {RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./Pages/Root";
import Home from './Pages/Home/Home';
import SpecialCards from './Pages/SpecialCards/SpecialCards';
import About from './Pages/About/About';
import Login from './Pages/Auth/Login/Login';
import Register from './Pages/Auth/Register/Register';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';


const router=createBrowserRouter([{
  path:"/",
  element:<Root/>,
  children:[
    {index:true,element:<Home/>},
    {path:"about",element:<About/>},
    {path:"login",element:<Login/>},
    {path:"register",element:<Register/>},
    {path:"special-cards",element:<SpecialCards/>}
  ]
}])  



function App() {

  const {i18n:control}=useTranslation();

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
  
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>

      <RouterProvider router={router}/>

    </QueryClientProvider>
  );
}

export default App;
