import { useMutation } from '@tanstack/react-query';
import React from 'react'
import toast from 'react-hot-toast';
import { controlColors } from '../../../../util/Http';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import styles from "../AdminPages.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYinYang } from '@fortawesome/free-solid-svg-icons';
import InputErrorMessage from '../../../../Components/Ui/InputErrorMessage';

const AddColor = ({refetch}) => {


    const { t: key } = useTranslation();
    const token = JSON.parse(localStorage.getItem("token"));
    
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

    const { mutate, isPending } = useMutation({
        mutationFn: controlColors,
        onSuccess: (data) => {
          if (data?.status === "success") {
            notifySuccess(key("opSuccess"));
            refetch()
          } else {
            notifyError(key("wrong"));
          }
        },
        onError: (error) => {
          notifyError(key("wrong"));
        },
      });
    
      const initialValues = {
        hex: "",
      };
    
      const onSubmit = (values) => {
    
        mutate({
          formData: values,
          token: token,
          method: "add",
        });
      };
    
      const validationSchema = object({
        hex: string().required(`${key("colorreq")}`),
      });
    


  return (
    <>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form className={styles.general_info_form}>
            <div className={styles.field}>
              <label className='fw-bold text-secondary' htmlFor="color">
                {key("add")} {key("color")}
              </label>
              <Field type="text" id="color" name="hex" />
              <ErrorMessage name="hex" component={InputErrorMessage} />
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
        </Formik> 
    </>
  )
}

export default AddColor
