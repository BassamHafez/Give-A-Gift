import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import styles from "./TopStores.module.css";
import { useQuery } from "@tanstack/react-query";
import { getShops } from "../../util/Http";

const TopStores = () => {
  
  const { data: shops } = useQuery({
    queryKey: ["shops"],
    queryFn: getShops,
    staleTime:Infinity
  });

  return (
    <div dir="ltr">
      {shops && (
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
          {shops?.data?.map((shop) => (
              <SwiperSlide className={styles.company} key={shop._id}>
                <div className={styles.single_container}>
                  <img
                    src={`${process.env.REACT_APP_Host}shops/${shop.logo}`}
                    alt={`${shop.name}`}
                  />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      )}
    </div>
  );
};

export default TopStores;
