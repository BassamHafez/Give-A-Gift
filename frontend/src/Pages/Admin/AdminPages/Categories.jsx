import React, { useEffect, useState } from "react";
import styles from "./AdminPages.module.css";
import { categoriesController } from "../../../util/Http";
import { useQuery } from "@tanstack/react-query";
import { faTrash, faWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import LoadingOne from "../../../Components/Ui/LoadingOne";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddCategory from "./CategoriesForms/AddCategory";
import UpdateCategory from "./CategoriesForms/UpdateCategory";

const Categories = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({});
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const role = useSelector((state) => state.userInfo.role);
  const profileData = useSelector((state) => state.profileInfo.data);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "user") {
      navigate(`/`);
    } else if (role === "merchant") {
      navigate(`/merchant/${profileData?._id}`);
    }
  }, [role, navigate, profileData]);

  const { data: categories, refetch } = useQuery({
    queryKey: ["categories", token],
    queryFn: () => categoriesController({ type: "get", token: token }),
    staleTime: Infinity,
    enabled: !!token,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const deleteCategory = async (catId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_Base_API_URl}categories/${catId}`,
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
      console.error(error);
      notifyError(key("wrong"));
    }
  };

  const openUpdateShopModal = (cat) => {
    setSelectedCategory(cat);
    setUpdateModalShow(true);
  };

  return (
    <>
      <div className={styles.main_body}>
        <div className={styles.configs_body}>
          <AddCategory refetch={refetch} />
        </div>

        <hr />

        <h4 className="fw-bold">{key("storesPageTitle")} </h4>

        <Row className="justify-content-center">
          {categories ? (
            categories.data?.map((cat) => (
              <Col
                key={cat._id}
                sm={4}
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <div className={styles.shop_div}>
                  <div className={styles.shop_control}>
                    <FontAwesomeIcon
                      className={styles.shop_control_icon}
                      icon={faWrench}
                      onClick={() => openUpdateShopModal(cat)}
                      title={`${key("update")}`}
                    />

                    <FontAwesomeIcon
                      className={styles.shop_control_icon}
                      icon={faTrash}
                      onClick={() => deleteCategory(cat._id)}
                      title={`${key("delete")}`}
                    />
                  </div>
                  <img
                    src={`${process.env.REACT_APP_Host}categories/${cat.icon}`}
                    alt="cat_img"
                  />
                  <div className="text-center">
                    <span >
                      {isArLang ? cat.name : cat.enName}
                    </span>
                  </div>
                </div>
              </Col>
            ))
          ) : (
            <LoadingOne />
          )}
        </Row>
      </div>
      {updateModalShow && (
        <UpdateCategory
          show={updateModalShow}
          onHide={() => setUpdateModalShow(false)}
          categoryData={selectedCategory}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default Categories;
