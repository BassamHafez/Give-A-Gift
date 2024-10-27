import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getShops } from "../../util/Http";
import styles from "./Stores.module.css";
import LoadingOne from "../../Components/Ui/LoadingOne";
import Placeholders from "../../Components/Ui/Placeholders";
import Row from "react-bootstrap/esm/Row";
import SingleReadyCard from "../../Components/Ui/SingleReadyCard";
import MainTitle from "../../Components/Ui/MainTitle";
import customGiftCard from "../../Images/home2.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { customCardActions } from "../../Store/customCardStore-slice";
import { useTranslation } from "react-i18next";
import Container from "react-bootstrap/esm/Container";

const StoreProfile = () => {
  const { storeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t: key } = useTranslation();

  const { data: shop, isFetching } = useQuery({
    queryKey: ["getSingleshops", storeId],
    queryFn: () => getShops({ type: "single", storeId }),
    staleTime: Infinity,
  });

  const goToCustomCards = () => {
    dispatch(customCardActions.setIsStoreSelected(true));
    dispatch(customCardActions.setStoreId(storeId));
    dispatch(customCardActions.setStoreLogo(shop?.data?.shop?.logo));
    navigate(`/custom-cards`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {shop ? (
        <div className={styles.content}>
          <div className={styles.myStore_header}>
            <Link
              target="_blank"
              to={`${shop?.data?.shop?.link}`}
              rel="noopener noreferrer"
            >
              <div className={styles.store_logo}>
                <img
                  src={`${process.env.REACT_APP_Host}shops/${shop?.data?.shop?.logo}`}
                  alt={`${shop?.data?.shop?.name}_logo`}
                />
                <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare}
                  className={styles.link_icon}
                />
              </div>
            </Link>

            <div className="text-center">
              <h1 className="fw-bold">{shop?.data?.shop?.name}</h1>
              <h5 className="text-secondary">
                {shop?.data?.shop?.description}
              </h5>
            </div>
          </div>
          <div className={styles.profile_body}>
            <div className="py-5 d-flex justify-content-center align-items-center">
              <MainTitle title={key("createCardPageTitle")} />
            </div>
            <div
              onClick={goToCustomCards}
              className=" mb-5 d-flex justify-content-center"
              style={{ cursor: "pointer" }}
            >
              <div className={styles.customGiftCard}>
                <img src={customGiftCard} alt={key("createCardPageTitle")} />
              </div>
            </div>

            {shop?.data?.readyCards?.length > 0 ? (
              <div>
                <div className="py-5 d-flex justify-content-center">
                  <MainTitle title={key("buyCardNavTitle")} />
                </div>
                <Container fluid>
                  <Row className="justify-content-center">
                    <>
                      {isFetching ? (
                        <Placeholders />
                      ) : (
                        <>
                          {shop.data?.readyCards.map((card) => (
                            <SingleReadyCard
                              size={true}
                              isStoreProfile={true}
                              card={card}
                            />
                          ))}
                        </>
                      )}
                    </>
                  </Row>
                </Container>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <LoadingOne />
      )}
    </>
  );
};

export default StoreProfile;
