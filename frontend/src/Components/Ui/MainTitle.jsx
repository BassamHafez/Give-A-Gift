import React from 'react';
import styles from "./MainTitle.module.css";
import logo from "../../Images/logo.png"
const MainTitle = ({title}) => {
  return (
    <div className={styles.main_title_div}>
      <img className={styles.logo} src={logo} alt='logo'/>
      <h2>{title}</h2>
      <img className={styles.logo} src={logo} alt='logo'/>
    </div>
  )
}

export default MainTitle
