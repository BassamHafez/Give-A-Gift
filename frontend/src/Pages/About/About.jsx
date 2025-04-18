import React from "react";
import HomeSections from "../../Components/Ui/HomeSections";
import { useTranslation } from "react-i18next";
import styles from "./About.module.css";
import MainButton from "../../Components/Ui/MainButton";
import TopStores from "../../Components/TopStores/TopStores";
import { useNavigate } from "react-router-dom";
import AboutFooter from "../../Components/Footer/AboutFooter";

const About = () => {
  const { t: key } = useTranslation();
  const navigate=useNavigate();
  return (
    <>
      <div className={styles.joiu_us_container}>
        <div className={styles.joiu_us}>
          <span>
            {key("becomePartner")}
          </span>
          <h1>{key("joinUsTitle")}</h1>
          <div className="mt-4">
           <MainButton onClick={()=>navigate(`/joinUs`)} text={key("join")} />
          </div>
        </div>
      </div>
      <section className={styles.top_stores}>
        <TopStores />
      </section>
      <HomeSections />
      <AboutFooter/>
    </>
  );
};

export default About;
