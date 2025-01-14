import React, { useEffect, useState } from "react";
import styles from "./AdminPages.module.css";
import Table from "react-bootstrap/Table";
import { useQuery } from "@tanstack/react-query";
import { getMyCards } from "../../../util/Http";
import LoadingOne from "../../../Components/Ui/LoadingOne";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import SearchField from "../../../Components/Ui/SearchField";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NoDataPage from "../../../Components/Ui/NoDataPage";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

const AdminCarts = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  const VAT = useSelector((state) => state.configs.VAT);
  const celebrateIconPrice = useSelector(
    (state) => state.configs.celebrateIconPrice
  );
  const celebrateLinkPrice = useSelector(
    (state) => state.configs.celebrateLinkPrice
  );

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data } = useQuery({
    queryKey: ["getMyCards", token],
    queryFn: () => getMyCards(token),
    enabled: !!token,
  });

  const calculateTotalPrice = (
    cardPrice,
    proColorPrice,
    ShapeArr,
    celebrateIcon,
    CelebrateLink
  ) => {
    let totalShapesPrice = ShapeArr.reduce((sum, shape) => {
      const price = shape.shape?.price || 0;
      return sum + price;
    }, 0);

    const totalPurePrice =
      Number(cardPrice) +
      (proColorPrice ? Number(proColorPrice) : 0) +
      (celebrateIcon ? Number(celebrateIconPrice) : 0) +
      (CelebrateLink ? Number(celebrateLinkPrice) : 0) +
      (totalShapesPrice ? Number(totalShapesPrice) : 0);

    const totalCardPrice =
      (Number(VAT) / 100) * totalPurePrice + totalPurePrice;
    return totalCardPrice;
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString("en-GB");
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { formattedDate, formattedTime };
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const sendSelectedId = async () => {
    let cardsIds = [];
    if (selectedIds.length > 0) {
      cardsIds = [...selectedIds];
    } else {
      const allIds = data.data
        .filter((cart) => !cart.isPaid)
        .map((cart) => cart._id);
      cardsIds = [...allIds];
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_Base_API_URl}cards/reminders`,
        { cardsIds: [...cardsIds] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let res = response.data;
      if (res.status === "success") {
        notifySuccess(key("sentSucc"));
      } else {
        notifyError(key("wrong"));
      }
    } catch (error) {
      notifyError(key("wrong"));
      console.error(error);
    }
  };

  const handleSearch = (e, searchTerm) => {
    e.preventDefault();
    if (searchTerm !== "" && searchTerm !== searchInput) {
      setSearchInput(searchTerm);
    }
  };

  const filteredCarts = data
    ? data.data.filter(
        (cart) =>
          cart.shop?.name
            .toLowerCase()
            .trim()
            .includes(searchInput.toLowerCase().trim()) ||
          cart.user?.name
            .toLowerCase()
            .trim()
            .includes(searchInput.toLowerCase().trim()) ||
          cart.user?.phone === searchInput
      )
    : [];

  return (
    <div className={styles.table_body}>
      <div className="d-flex justify-content-between align-itmes-center my-4">
        <h4 className="text-secondary">{key("allCarts")}</h4>

        <button onClick={sendSelectedId} className="btn btn-danger">
          {selectedIds.length > 0
            ? key("sendReminder")
            : key("sendReminderAll")}
        </button>
      </div>
      <hr />
      <div className="d-flex flex-wrap justify-content-end align-itmes-center my-4">
        <button
          onClick={() => setSearchInput("")}
          className="btn btn-outline-danger"
        >
          {key("default")}
        </button>
        <SearchField onSearch={handleSearch} text={key("search")} />
      </div>
      {data ? (
        data.data?.length > 0 ? (
          <>
            <Table striped bordered hover className={styles.hidden_mobile}>
              <thead>
                <tr className="text-center">
                  <th>{key("select")}</th>
                  <th>{key("name")}</th>
                  <th>{key("myPhone")}</th>
                  <th>{key("store")}</th>
                  <th>{key("price")}</th>
                  <th>{key("afterDiscount")}</th>
                  <th>{key("date")}</th>
                  <th>{key("time")}</th>
                </tr>
              </thead>
              <tbody className={styles.cart_tbody}>
                {filteredCarts.length > 0
                  ? filteredCarts.map(
                      (cart) =>
                        !cart.isPaid && (
                          <tr
                            key={cart._id}
                            onClick={() => handleCheckboxChange(cart._id)}
                          >
                            <td className="text-center">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(cart._id)}
                                onChange={() => handleCheckboxChange(cart._id)}
                              />
                            </td>
                            <td className="text-center">{cart.user?.name}</td>
                            <td className="text-center">{cart.user?.phone}</td>
                            <td className="text-center">{cart.shop?.name}</td>
                            <td className="text-center">
                              {calculateTotalPrice(
                                cart.price.value,
                                cart.proColorPrice?.price,
                                cart.shapes,
                                cart.celebrateIcon,
                                cart.celebrateQR
                              )}{" "}
                              {key("sar")}
                            </td>
                            <td className="text-center">
                              {cart.priceAfterDiscount
                                ? `${cart.priceAfterDiscount} ${key("sar")}`
                                : "-"}
                            </td>
                            <td className="text-center">
                              {formatDateTime(cart.createdAt).formattedDate}
                            </td>
                            <td className="text-center">
                              {formatDateTime(cart.createdAt).formattedTime}
                            </td>
                          </tr>
                        )
                    )
                  : data?.data?.map(
                      (cart) =>
                        !cart.isPaid && (
                          <tr
                            key={cart._id}
                            onClick={() => handleCheckboxChange(cart._id)}
                          >
                            <td className="text-center">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(cart._id)}
                                onChange={() => handleCheckboxChange(cart._id)}
                              />
                            </td>
                            <td className="text-center">{cart._id}</td>
                            <td className="text-center">
                              {calculateTotalPrice(
                                cart.price.value,
                                cart.proColorPrice?.price,
                                cart.shapes,
                                cart.celebrateIcon,
                                cart.celebrateQR
                              )}{" "}
                              {key("sar")}
                            </td>
                            <td className="text-center">
                              {cart.priceAfterDiscount
                                ? `${cart.priceAfterDiscount} ${key("sar")}`
                                : "-"}
                            </td>
                            <td className="text-center">
                              {formatDateTime(cart.createdAt).formattedDate}
                            </td>
                            <td className="text-center">
                              {formatDateTime(cart.createdAt).formattedTime}
                            </td>
                          </tr>
                        )
                    )}
              </tbody>
            </Table>

            <div className={styles.show_small_screens}>
              <Row>
                {filteredCarts?.map(
                  (cart) =>
                    !cart.isPaid && (
                      <Col
                        xs={12}
                        key={cart.id}
                        onClick={() => handleCheckboxChange(cart._id)}
                      >
                        <div
                          className={`${styles.user_div} ${
                            selectedIds.includes(cart._id)
                              ? styles.blue_border
                              : ""
                          }`}
                          style={{ cursor: "pointer" }}
                        >
                          <ul className="p-0 mt-4">
                            <li className={styles.details_list}>
                              {key("name")}: {cart.user?.name}
                            </li>
                            <li className={styles.details_list}>
                              {key("myPhone")}: {cart.user?.phone}
                            </li>
                            <li className={styles.details_list}>
                              {key("store")}: {cart.shop?.name}
                            </li>
                            <li className={styles.details_list}>
                              {key("store")}: {cart.shop_name}
                            </li>
                            <li className={styles.details_list}>
                              {key("price")}:{" "}
                              {calculateTotalPrice(
                                cart.price.value,
                                cart.proColorPrice?.price,
                                cart.shapes,
                                cart.celebrateIcon,
                                cart.celebrateQR
                              )}{" "}
                              {key("sar")}
                            </li>
                            <li className={styles.details_list}>
                              {key("afterDiscount")}:{" "}
                              {cart.priceAfterDiscount
                                ? `${cart.priceAfterDiscount} ${key("sar")}`
                                : "-"}
                            </li>
                            <li className={styles.details_list}>
                              {key("date")}:{" "}
                              {formatDateTime(cart.createdAt).formattedDate}
                            </li>
                            <li className={styles.details_list}>
                              {key("time")}:{" "}
                              {formatDateTime(cart.createdAt).formattedTime}
                            </li>
                          </ul>
                        </div>
                      </Col>
                    )
                )}
              </Row>
            </div>
          </>
        ) : (
          <NoDataPage text={`${key("noCarts")}`} />
        )
      ) : (
        <LoadingOne />
      )}
    </div>
  );
};

export default AdminCarts;
