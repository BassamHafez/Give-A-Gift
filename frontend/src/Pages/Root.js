import React from 'react'
import MainNav from "../Components/MainNavbar/MainNav";
import Footer from "../Components/Footer/Footer";
import { Outlet } from 'react-router-dom';

const Root = () => {
  return (
    <>
      <MainNav/>
      <Outlet/>
      <Footer/>
    </>
  )
}

export default Root
