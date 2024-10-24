import React, { useEffect, useState } from "react";
import styles from "../AdminPages.module.css";
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

const AddCard = ({ refetch }) => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [myShops, setMyShops] = useState([]);
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { data: shops } = useQuery({
    queryKey: ["shops", token],
    queryFn: getShops,
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
    mutationFn: controlSpecialCards,
    onSuccess: (data) => {
      if (data?.status === "success") {
        notifySuccess(key("opSuccess"));
        refetch();
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
    shop: "",
    price: "",
    priority: "",
  };

  const onSubmit = (values) => {
    mutate({
      formData: values,
      token: token,
      method: "add",
    });
  };

  const validationSchema = object({
    shop: string().required(`${key("shoprec")}`),
    price: number()
      .required(`${key("priceRec")}`)
      .min(1, key("priceVali")),
    priority: number()
      .typeError(key("priorityValidation"))
      .required(key("priReq")),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ setFieldValue }) => (
        <Form>
          <div className={styles.field}>
            <label htmlFor="shop" className="text-secondary">
              {key("store")}
            </label>
            <Select
              classNamePrefix="storeSelect"
              isClearable={false}
              isSearchable={true}
              name="shop"
              id="shop"
              placeholder={key("store")}
              options={myShops ? myShops : []}
              onChange={(value) => {
                setFieldValue("shop", value.value);
              }}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="price">{key("price")}</label>
            <Field type="text" id="price" name="price" className="p-2" />
            <ErrorMessage name="price" component={InputErrorMessage} />
          </div>

          <div className={styles.field}>
            <label className="text-secondary" htmlFor="priority">
              {key("priority")}
            </label>
            <Field type="number" id="priority" name="priority"  className="p-2"/>
            <ErrorMessage name="priority" component={InputErrorMessage} />
          </div>

          <div className="d-flex justify-content-end align-items-center mt-3 px-2">
            {isPending ? (
              <button type="submit" className={styles.save_btn}>
                <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
              </button>
            ) : (
              <button className={styles.save_btn} type="submit">
                {key("add")}
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddCard;
