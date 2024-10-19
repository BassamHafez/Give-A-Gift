import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getShops, getSpecialCards } from "../../util/Http";
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

const StoreProfile = () => {
  const { storeId } = useParams();
  const [myStore, setMyStore] = useState({});
  const token = JSON.parse(localStorage.getItem("token"));
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const { data: shops } = useQuery({
    queryKey: ["shops"],
    queryFn: getShops,
    staleTime: Infinity,
  });

  const { data, isFetching } = useQuery({
    queryKey: ["special-cards", token],
    queryFn: getSpecialCards,
    staleTime: Infinity,
  });

  const goToCustomCards=()=>{
    dispatch(customCardActions.setIsStoreSelected(true))
    dispatch(customCardActions.setStoreId(storeId))
    dispatch(customCardActions.setStoreLogo(myStore.logo))
    navigate(`/custom-cards`)
  }

  useEffect(() => {
    if (shops) {
      const myShop = shops.data.find((shop) => shop._id === storeId);
      setMyStore(myShop);
    }
  }, [shops, storeId]);
  useEffect(()=>{
    window.scrollTo(0, 0)
  },[])

  return (
    <>
      {myStore ? (
        <div className={styles.content}>
          <div className={styles.myStore_header}>
            <Link
              target="_blank"
              to={`${myStore.link}`}
              rel="noopener noreferrer"
            >
              <div className={styles.store_logo}>
                <img
                  src={`${process.env.REACT_APP_Host}shops/${myStore.logo}`}
                  alt={`${myStore.name}_logo`}
                />
                <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare}
                  className={styles.link_icon}
                />
              </div>
            </Link>

            <div className="text-center">
              <h1 className="fw-bold">{myStore.name}</h1>
              <h5 className="text-secondary">{myStore.description}</h5>
            </div>
          </div>
          <div className={styles.profile_body}>
            <div className="py-5 d-flex justify-content-center">
              <MainTitle title="Special Cards" />
            </div>
            <div onClick={goToCustomCards} className=" mb-5 d-flex justify-content-center" style={{cursor:"pointer"}}>
              <img
                className={styles.customGiftCard}
                src={customGiftCard}
                alt="Special Cards"
              />
            </div>

            <div>
              <div className="py-5 d-flex justify-content-center">
                <MainTitle title="Ready Cards" />
              </div>
              <Row>
                {isFetching ? (
                  <Placeholders />
                ) : (
                  <>
                    {data.data?.cards.map((card) => (
                      <SingleReadyCard card={card} />
                    ))}
                  </>
                )}
              </Row>
            </div>
          </div>
        </div>
      ) : (
        <LoadingOne />
      )}
    </>
  );
};

export default StoreProfile;
