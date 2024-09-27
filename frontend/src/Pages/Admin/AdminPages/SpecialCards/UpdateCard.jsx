import React, { useEffect, useState } from "react";
import styles from "../AdminPages.module.css";
import Modal from "react-bootstrap/Modal";
import { controlSpecialCards, getShops } from "../../../../util/Http";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik, Field } from "formik";
import { number, object, string } from "yup";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import InputErrorMessage from "../../../../Components/Ui/InputErrorMessage";
import Select from "react-select";

const UpdateCard = ({ show, onHide, cardId, refetch, shopId }) => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [myShops, setMyShops] = useState([]);
  const [initialShop, setInitialShop] = useState(null);
  const notifySuccess = (message) => {
    toast.success((t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
        onTap={() => toast.dismiss(t.id)}
      >
        {message}
      </div>
    ));
  };

  const notifyError = (message) => {
    toast.error((t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
        onTap={() => toast.dismiss(t.id)}
      >
        {message}
      </div>
    ));
  };

  const { data: shops } = useQuery({
    queryKey: ["shops", token],
    queryFn: getShops,
    staleTime: 300000,
  });

  useEffect(() => {
    if (shops) {
      const shopArr = shops.data?.map((shop) => ({
        label: shop.name,
        value: shop._id,
      }));
      setMyShops(shopArr);

      const selectedShop = shopArr.find((shop) => shop.value === shopId);
      setInitialShop(selectedShop || null);
    }
  }, [shops, shopId]);

  const { mutate, isPending } = useMutation({
    mutationFn: controlSpecialCards,
    onSuccess: (data) => {
      if (data?.status === "success") {
        notifySuccess(key("opSuccess"));
        refetch();
        onHide();
      } else if (data?.response?.data?.error?.code === 11000) {
        notifyError(key("dupName"));
      } else {
        notifyError(key("wrong"));
      }
    },
    onError: (error) => {
      notifyError(key("wrong"));
    },
  });

  const initialValues = {
    shop: shopId || "",
    price: "",
  };

  const onSubmit = (values) => {
    mutate({
      formData: values,
      token: token,
      method: "update",
      cardId: cardId,
    });
  };

  const validationSchema = object({
    shop: string(),
    price: number()
      .required(`${key("priceRec")}`)
      .min(1, key("priceVali")),
  });

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className={styles.modal_container}
      >
        <Modal.Body className={`${styles.modal_body} text-center`}>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
            enableReinitialize
          >
            {({ setFieldValue }) => (
              <Form>
                <h4 className="fw-bold">
                  {key("add")} {key("store")}
                </h4>
                <Select
                  className={`mb-3`}
                  classNamePrefix="FontFamily"
                  isClearable={false}
                  isSearchable={true}
                  name="shop"
                  placeholder={key("store")}
                  options={myShops ? myShops : []}
                  value={initialShop}
                  onChange={(value) => {
                    setFieldValue("shop", value.value);
                    setInitialShop(value);
                  }}
                />
                <div className={styles.field}>
                  <label className="text-center mt-3" htmlFor="price">{key("price")}</label>
                  <Field type="text" id="price" name="price" />
                  <ErrorMessage name="price" component={InputErrorMessage} />
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
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UpdateCard;
