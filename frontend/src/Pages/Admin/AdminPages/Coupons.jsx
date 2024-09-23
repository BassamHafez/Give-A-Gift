import React, { useEffect, useState } from "react";
import styles from "./AdminPages.module.css";
import toast, { Toaster } from "react-hot-toast";
import AddCoupon from "./CouponsForms/AddCoupon";
import UpdateCoupon from "./CouponsForms/UpdateCoupon";
import { useQuery } from "@tanstack/react-query";
import { controlCoupons } from "../../../util/Http";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import LoadingOne from "../../../Components/Ui/LoadingOne";
import { useTranslation } from "react-i18next";
import MainButton from "../../../Components/Ui/MainButton";
import axios from "axios";

const Coupons = () => {
  const [modalShow, setModalShow] = useState(false);
  const [copId, setCopId] = useState("");
  const [expire, setExpire] = useState("");
  const [discount, setDiscount] = useState("");
  const [name, setName] = useState("");

  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { data: coupons, refetch } = useQuery({
    queryKey: ["coupons", token],
    queryFn: () => controlCoupons({ token, method: "get" }),
    enabled: !!token,
    staleTime: Infinity,
  });
  useEffect(()=>{
    window.scrollTo(0, 0)
  },[])
  const deleteCoupon = async (couponId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_Base_API_URl}coupons/${couponId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 204) {
        notifySuccess(key("opSuccess"));
        refetch();
      } else {
        notifyError(key("wrong"));
      }
    } catch (error) {
      notifyError(key("wrong"));
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className={styles.main_body}>
        <div className="p-4 my-5">
          <AddCoupon refetch={refetch} />
        </div>
      </div>
      <hr />
      <h4 className="fw-bold mx-3">All Coupons</h4>
      <Row className="justify-content-center">
        {coupons ? (
          coupons?.data?.map((cop) => (
            <Col
              key={cop._id}
              md={6}
              className="d-flex justify-content-center align-items-center"
            >
              <div className={styles.cop_div}>
                <div className={styles.cop_content}>
                  <ul>
                    <li>
                      {key("name")}: {cop.name}
                    </li>
                    <li>
                      {key("discount")}: {cop.discount}
                    </li>
                    <li>
                      {key("expire")}: {cop.expire}
                    </li>
                  </ul>
                </div>
                <div className="d-flex flex-wrap">
                  <div className="m-3">
                    <MainButton
                      onClick={() => deleteCoupon(cop._id)}
                      text={key("delete")}
                    />
                  </div>
                  <div className="m-3">
                    <MainButton
                      onClick={() => {
                        setCopId(cop._id);
                        setExpire(cop.expire);
                        setDiscount(cop.discount);
                        setName(cop.name);
                        setModalShow(true);
                      }}
                      type="white"
                      text={key("update")}
                    />
                  </div>
                </div>
              </div>
            </Col>
          ))
        ) : (
          <LoadingOne />
        )}
      </Row>
      {modalShow && (
        <UpdateCoupon
          show={modalShow}
          onHide={() => setModalShow(false)}
          copId={copId}
          expire={expire}
          name={name}
          discount={discount}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default Coupons;
