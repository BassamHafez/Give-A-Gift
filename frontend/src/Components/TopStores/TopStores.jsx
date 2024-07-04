import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import styles from "./TopStores.module.css";
import L1 from "../../Images/Stores/shop1.png";
import L2 from "../../Images/Stores/shop2.png";
import L3 from "../../Images/Stores/shop3.png"
import L4 from "../../Images/Stores/shop4.png";
import L5 from "../../Images/Stores/shop5.png";
import L6 from "../../Images/Stores/shop6.jpg";
import L7 from "../../Images/Stores/shop7.jpg";
import L8 from "../../Images/Stores/shop8.jpg";
import L9 from "../../Images/Stores/shop9.jpg"
import L10 from "../../Images/Stores/shop10.jpg";
import L11 from "../../Images/Stores/shop11.png";
import L12 from "../../Images/Stores/shop12.jpeg";
import L13 from "../../Images/Stores/shop13.jpeg";
import L14 from "../../Images/Stores/shop14.png";
import L15 from "../../Images/Stores/shop15.png";
import L16 from "../../Images/Stores/shop16.png";
import L17 from "../../Images/Stores/shop17.png";


const TopStores = () => {
  return (
    <>

        <Swiper
          slidesPerView={4}
          spaceBetween={10}
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
          }}
          navigation={true}
          pagination={{
            clickable: true,
            type: "custom",
          }}
          loop={true}
          speed={3000}
          breakpoints={{
            "@0.00": {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            "@0.75": {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            "@1.00": {
              slidesPerView: 3,
              spaceBetween: 40,
            },
            "@1.50": {
              slidesPerView: 4,
              spaceBetween: 50,
            },
          }}
          modules={[Pagination, Autoplay, Navigation]}
          className={`${styles.swiper_content} mySwiper`}
        >
          {" "}
          <SwiperSlide className={styles.company}>
            <div className={styles.single_container}>
              <img src={L1} alt="logo company" />
            </div>
          </SwiperSlide>
          <SwiperSlide className={styles.company}>
            <div className={styles.single_container}>
              <img src={L2} alt="logo company" />
            </div>
          </SwiperSlide>
          <SwiperSlide className={styles.company}>
            <div className={styles.single_container}>
              <img src={L3} alt="logo company" />
            </div>
          </SwiperSlide>
          <SwiperSlide className={styles.company}>
            <div className={styles.single_container}>
              <img src={L4} alt="logo company" />
            </div>
          </SwiperSlide>
          <SwiperSlide className={styles.company}>
            <div className={styles.single_container}>
              <img src={L5} alt="logo company" />
            </div>
          </SwiperSlide>
          <SwiperSlide className={styles.company}>
            <div className={styles.single_container}>
              <img src={L6} alt="logo company" />
            </div>
          </SwiperSlide>
          <SwiperSlide className={styles.company}>
            <div className={styles.single_container}>
              <img src={L7} alt="logo company" />
            </div>            </SwiperSlide>
          <SwiperSlide className={styles.company}>
            <div className={styles.single_container}>
              <img src={L8} alt="logo company" />
            </div>            </SwiperSlide>
          <SwiperSlide className={styles.company}>
            <div className={styles.single_container}>
              <img src={L9} alt="logo company" />
            </div>            </SwiperSlide>
          <SwiperSlide className={styles.company}>
            <div className={styles.single_container}>
              <img src={L10} alt="logo company" />
            </div>
          </SwiperSlide>
          <SwiperSlide className={styles.company}>
            <div className={styles.single_container}>
              <img src={L11} alt="logo company" />
            </div>
          </SwiperSlide>
          <SwiperSlide className={styles.company}>
            <div className={styles.single_container}>
              <img src={L12} alt="logo company" />
            </div>
          </SwiperSlide>
          <SwiperSlide className={styles.company}>
            <div className={styles.single_container}>
              <img src={L13} alt="logo company" />
            </div>
          </SwiperSlide>
          <SwiperSlide className={styles.company}>
            <div className={styles.single_container}>
              <img src={L14} alt="logo company" />
            </div>
          </SwiperSlide>
          <SwiperSlide className={styles.company}>
            <div className={styles.single_container}>
              <img src={L15} alt="logo company" />
            </div>
          </SwiperSlide>
          <SwiperSlide className={styles.company}>
            <div className={styles.single_container}>
              <img src={L16} alt="logo company" />
            </div>
          </SwiperSlide>
          <SwiperSlide className={styles.company}>
            <div className={styles.single_container}>
              <img src={L17} alt="logo company" />
            </div>
          </SwiperSlide>
        </Swiper>
      </>
  )
}

export default TopStores
