import React, { useEffect, useState } from "react";
import styles from "../AdminPages.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretLeft,
  faCaretRight,
  faYinYang,
} from "@fortawesome/free-solid-svg-icons";
import InputErrorMessage from "../../../../Components/Ui/InputErrorMessage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { controlShops, getShops } from "../../../../util/Http";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { number, object } from "yup";
import Select from "react-select";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import LoadingOne from "../../../../Components/Ui/LoadingOne";

const TopShopsPriority = () => {
  const { t: key } = useTranslation();
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const [myShops, setMyShops] = useState([]);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const { data: shops, refetch } = useQuery({
    queryKey: ["shops", token],
    queryFn: () => getShops({ type: "top" }),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (shops) {
      const shopArr = shops?.data?.map((shop) => ({
        label: shop.name,
        value: shop._id,
      }));
      setMyShops(shopArr);
    }
  }, [shops]);

  const { mutate, isPending } = useMutation({
    mutationFn: controlShops,
  });

  const initialValues = {
    shopId: "",
    priorityInTopShops: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const formData = new FormData();
    formData.append("priorityInTopShops", values.priorityInTopShops);

    mutate(
      {
        formData: formData,
        token: token,
        type: "update",
        shopId: values.shopId,
      },
      {
        onSuccess: (data) => {
          if (data?.status === "success") {
            refetch();
            resetForm();
          } else {
            notifyError(key("wrong"));
          }
        },
        onError: (error) => {
          notifyError(key("wrong"));
        },
      }
    );
  };

  const validationSchema = object({
    priorityInTopShops: number().required("priReq"),
  });

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ setFieldValue }) => (
          <Form className={styles.general_info_form}>
            <div className={styles.field}>
              <label htmlFor="shop" className="text-secondary">
                {key("topShopPri")}
              </label>
              <Select
                classNamePrefix="storeSelect"
                isClearable={false}
                isSearchable={true}
                name="shopId"
                id="shop"
                placeholder={key("store")}
                options={myShops ? myShops : []}
                onChange={(value) => {
                  setFieldValue("shopId", value.value);
                }}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="priorityInTopShops" className="mt-3">
                {key("priority")}
              </label>
              <Field
                type="number"
                id="priorityInTopShops"
                name="priorityInTopShops"
              />
              <ErrorMessage
                name="priorityInTopShops"
                component={InputErrorMessage}
              />
            </div>

            <div className="d-flex justify-content-end align-items-center mt-3 px-2">
              {isPending ? (
                <button type="submit" className={styles.save_btn}>
                  <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
                </button>
              ) : (
                <button className={styles.save_btn} type="submit">
                  {key("update")}
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
      <hr />
      <Row className="justify-content-center">
        {shops ? (
          shops.data?.map((shop) => (
            <Col
              key={shop._id}
              sm={4}
              className="d-flex flex-column justify-content-center align-items-center"
            >
              <div className={styles.shop_div} title={`${shop.name}`}>
                <div className={styles.shop_control}>
                  <span className="d-flex align-items-center">
                    {key("priority")}
                    <FontAwesomeIcon
                      icon={isArLang ? faCaretLeft : faCaretRight}
                      className="mx-2 text-danger"
                    />
                    {shop.priorityInTopShops ? shop.priorityInTopShops : "0"}
                  </span>
                </div>
                <img
                  src={`${process.env.REACT_APP_Host}shops/${shop.logo}`}
                  alt="top_store"
                />
              </div>
            </Col>
          ))
        ) : (
          <LoadingOne />
        )}
      </Row>
    </>
  );
};

export default TopShopsPriority;
