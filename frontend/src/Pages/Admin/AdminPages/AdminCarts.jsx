import React, { useEffect, useState } from "react";
import styles from "./AdminPages.module.css";
import Table from "react-bootstrap/Table";
import { useQuery } from "@tanstack/react-query";
import { getMyCards } from "../../../util/Http";
import LoadingOne from "../../../Components/Ui/LoadingOne";
import noData from "../../../Images/noData.jpg";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import SearchField from "../../../Components/Ui/SearchField";
import toast from "react-hot-toast";
import axios from "axios";

const AdminCarts = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const notifySuccess = (message) => {
    toast.success((t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
      >
        {message}
      </div>
    ));
  };

  const notifyError = (message) => {
    toast.error((t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
      >
        {message}
      </div>
    ));
  };

  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  const VAT = useSelector((state) => state.configs.VAT);
  const celebrateIconPrice = useSelector(
    (state) => state.configs.celebrateIconPrice
  );
  const celebrateLinkPrice = useSelector(
    (state) => state.configs.celebrateLinkPrice
  );

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
      console.log(response);
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
      notifySuccess(key("searchFilterApplied"));
    }
  };

  const filteredCarts = data
    ? data.data.filter((cart) =>
        cart._id.toLowerCase().includes(searchInput.toLowerCase())
      )
    : [];

  return (
    <div className={styles.table_body}>
      <div className="d-flex justify-content-between align-itmes-center my-4">
        <h4 className="fw-bold text-secondary">{key("allCarts")}</h4>

        <button onClick={sendSelectedId} className="btn btn-danger">
          {selectedIds.length > 0
            ? key("sendReminder")
            : key("sendReminderAll")}
        </button>
      </div>
      <hr />
      <div className="d-flex flex-wrap justify-content-end my-4">
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
          <Table striped bordered hover>
            <thead>
              <tr className="text-center">
                <th>{key("select")}</th>
                <th>{key("cartId")}</th>
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
                  )
                : data.data.map(
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
        ) : (
          <div className={styles.noData}>
            <div className={styles.noData_img}>
              <img src={noData} alt="noData" />
            </div>
            <span>{key("noCarts")}</span>
          </div>
        )
      ) : (
        <LoadingOne />
      )}
    </div>
  );
};

export default AdminCarts;
