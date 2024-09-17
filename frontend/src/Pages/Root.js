import React, { useEffect, useState } from 'react'
import MainNav from '../Components/MainNavbar/MainNav';
import Footer from "../Components/Footer/Footer";
import { Outlet} from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import VerifyPhoneNumberModal from '../Components/Ui/VerifyPhoneNumberModal';
import { useTranslation } from 'react-i18next';
import { getConfig } from '../util/Http';
import { useQuery } from '@tanstack/react-query';


const Root = () => {

  const profileData = useSelector((state) => state.userInfo.data);
  const [modalShow,setModalShow]=useState();
  const {t:key}=useTranslation();
  const isLogin = useSelector((state) => state.userInfo.isLogin);


  const notifyError = (message) => toast((t) => (
    <span>
      {message}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: '10px'
        }}
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              borderRadius: '1.5625rem',
              fontSize: '1.125rem',
              fontWeight: '700',
              boxShadow: '0 0 0.1875rem rgba(0, 0, 0, 0.5)',
              padding: '0.625rem 0.9375rem',
              marginRight: 'auto',
            }}
          >
            {key("later")}
          </button>
  
          <button
          onClick={()=>{setModalShow(true);toast.dismiss(t.id)}}
          style={{
            borderRadius: '1.5625rem',
            minWidth: '6.25rem',
            fontSize: '1.125rem',
            fontWeight: '700',
            boxShadow: '0 0 0.1875rem rgba(0, 0, 0, 0.5)',
            padding: '0.625rem 0.9375rem',
            marginLeft: 'auto',
            backgroundColor:"red",
            color:"#FFF"
          }}
        >
          {key("verify")}
        </button>
        </div>
  
  
      </div>
    </span>
  ), {
    icon: '⚠️',
    style: {
      padding: '16px',
      color: '#000',
      fontWeight: '600',
    },
    duration: Infinity,
  });


  const { data } = useQuery({
    queryKey: ["configs"],
    queryFn: getConfig,
    staleTime: Infinity,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      if(!isLogin){
        return;
      }
      if (profileData?.phoneVerified === false) {
        notifyError(key("verifyMsg"));
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [profileData,isLogin]);



  const findConfigByKey = (arr, targetKey) => {
    return Array.isArray(arr) ? arr.find(config => config.key === targetKey) : undefined;
  };

  useEffect(() => {
      const mainColorValue = findConfigByKey(data?.data, "MAIN_COLOR")?.value;
      const subColorValue = findConfigByKey(data?.data, "SECONDRY_COLOR")?.value;
      
      if (mainColorValue) {
        document.documentElement.style.setProperty('--main_color', mainColorValue);
      }
      if (subColorValue) {
        document.documentElement.style.setProperty('--sub_color', subColorValue);
      }
  }, [data]);


  return (
    <>
      <Toaster position="top-right"/>
      <MainNav/>
      <Outlet/>
      <Footer/>
      {modalShow&&<VerifyPhoneNumberModal
        show={modalShow}
        onHide={()=>setModalShow(false)}
      />}
    </>
  )
}

export default Root
