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
import InputErrorMessage from "../../../../Components/Ui/InputErrorMessage";
import Select from "react-select";
import { toast } from "react-toastify";

const UpdateCard = ({ show, onHide, refetch,cardData }) => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [myShops, setMyShops] = useState([]);
  const [initialShop, setInitialShop] = useState(null);
  const notifyError = (message) => toast.error(message);

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

      const selectedShop = shopArr.find((shop) => shop.value === cardData.shop?._id);
      setInitialShop(selectedShop || null);
    }
  }, [shops, cardData.shop?._id]);

  const { mutate, isPending } = useMutation({
    mutationFn: controlSpecialCards,
    onSuccess: (data) => {
      if (data?.status === "success") {
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
    shop: cardData.shop?._id || "",
    price:cardData.price|| "",
    priority:cardData.priority||""
  };

  const onSubmit = (values) => {
    mutate({
      formData: values,
      token: token,
      method: "update",
      cardId: cardData._id,
    });
  };

  const validationSchema = object({
    shop: string(),
    price: number()
      .required(`${key("priceRec")}`)
      .min(1, key("priceVali")),
      priority: number()
      .typeError(key("priorityValidation"))
      .required(key("priReq")),
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
                <div className={styles.field}>
                  <label
                    htmlFor="updateShop"
                  >
                    {key("store")}
                  </label>
                  <Select
                    id="updateShop"
                    isClearable={false}
                    isSearchable={true}
                    name="shop"
                    options={myShops ? myShops : []}
                    value={initialShop}
                    onChange={(value) => {
                      setFieldValue("shop", value.value);
                      setInitialShop(value);
                    }}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="price">
                    {key("price")}
                  </label>
                  <Field type="text" id="price" name="price" className="p-2" />
                  <ErrorMessage name="price" component={InputErrorMessage} />
                </div>

                <div className={styles.field}>
                  <label className="text-secondary" htmlFor="priority">
                    {key("priority")}
                  </label>
                  <Field
                    type="number"
                    id="priority"
                    name="priority"
                    className="p-2"
                  />
                  <ErrorMessage name="priority" component={InputErrorMessage} />
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
