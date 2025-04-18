import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getAdminDiscount } from "../../../util/Http";
import styles from "./AdminPages.module.css";
import { useTranslation } from "react-i18next";
import MainButton from "../../../Components/Ui/MainButton";
import LoadingOne from "../../../Components/Ui/LoadingOne";
import Table from "react-bootstrap/Table";
import axios from "axios";
import SearchField from "../../../Components/Ui/SearchField";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NoDataPage from "../../../Components/Ui/NoDataPage";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

const Discounts = () => {
  const [usedData, setUsedData] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
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

  const { data, refetch } = useQuery({
    queryKey: ["discounts", token],
    queryFn: () => getAdminDiscount({ token }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const usedCount = data?.data?.filter((disc) => disc.isUsed).length || 0;
  const unusedCount = data?.data?.filter((disc) => !disc.isUsed).length || 0;

  const handleCheckboxChange = (id, isUsed) => {
    if (isUsed) {
      return;
    }
    setSelectedIds((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const sendSelectedId = async () => {
    let codesIds = [];
    if (selectedIds.length > 0) {
      codesIds = [...selectedIds];
    } else {
      const allIds = data.data
        .filter((disc) => !disc.isUsed)
        .map((disc) => disc.id);
      codesIds = [...allIds];
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_Base_API_URl}discount-codes/reminders`,
        { codesIds: [...codesIds] },
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

  const filteredDisc = data
    ? data.data.filter(
        (disc) =>
          disc.user_phone.toLowerCase() === searchInput.toLowerCase() ||
          disc.user_name.toLowerCase().includes(searchInput.toLowerCase()) ||
          disc?.order_number?.toString() === searchInput ||
          disc.shop_name.toLowerCase().includes(searchInput.toLowerCase())
      )
    : data?.data;

  const cancelDisc = async (discId) => {
    if (discId && token) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_Base_API_URl}discount-codes/${discId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 204) {
          notifySuccess(key("discDeleted"));
          refetch();
        } else {
          notifyError(key("wrong"));
        }
      } catch (error) {
        if (error?.response?.data?.message === "No order found for this card") {
          notifyError(key("noOrder"));
        } else {
          notifyError(key("wrong"));
        }
      }
    } else {
      notifyError(key("deleteDiscWrong"));
    }
  };

  return (
    <div className={styles.discount_body}>
      {data ? (
        data.data?.length > 0 ? (
          <>
            <div className="d-flex flex-wrap justify-content-between align-items-venter mb-3">
              <h4 className="fw-bolder">
                {key("allDisount")} ({usedData ? key("used") : key("notUsed")})
              </h4>
              <div className="d-flex flex-wrap align-items-center">
                <div className="m-2">
                  <MainButton
                    onClick={() => setUsedData(true)}
                    text={`${key("used")} (${usedCount})`}
                  />
                </div>
                <div className="m-2">
                  <MainButton
                    onClick={() => setUsedData(false)}
                    type="white"
                    text={`${key("notUsed")} (${unusedCount})`}
                  />
                </div>
              </div>
            </div>
            <hr />
            <div className="d-flex flex-wrap justify-content-end my-4">
              <button
                onClick={() => setSearchInput("")}
                className="btn btn-outline-danger my-2"
              >
                {key("default")}
              </button>
              <SearchField
                className="my-2"
                onSearch={handleSearch}
                text={key("search")}
              />
            </div>

            {!usedData && (
              <div className="text-end my-1 mb-4">
                <MainButton
                  type="blue"
                  onClick={sendSelectedId}
                  className="btn btn-primary"
                >
                  {selectedIds.length > 0
                    ? key("sendReminder")
                    : key("sendReminderAll")}
                </MainButton>
              </div>
            )}

            <Table striped bordered hover className={styles.hidden_mobile}>
              <thead>
                <tr className="text-center">
                  {!usedData && <th>{key("select")}</th>}
                  <th>{key("orderNumber")}</th>
                  <th>{key("name")}</th>
                  <th>{key("myPhone")}</th>
                  <th>{key("store")}</th>
                  {!usedData && <th>{key("cancelCode")}</th>}
                </tr>
              </thead>
              <tbody className={styles.cart_tbody}>
                {filteredDisc?.map(
                  (disc) =>
                    (usedData ? disc.isUsed : !disc.isUsed) && (
                      <tr
                        key={disc.id}
                        onClick={() =>
                          handleCheckboxChange(disc.id, disc.isUsed)
                        }
                      >
                        {!disc.isUsed && (
                          <td className="text-center">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(disc.id)}
                              onChange={() =>
                                handleCheckboxChange(disc.id, disc.isUsed)
                              }
                            />
                          </td>
                        )}
                        <td className="text-center">{`${
                          disc.order_number ? disc.order_number : "-"
                        }`}</td>
                        <td className={`text-center`}>{disc.user_name}</td>
                        <td className={`text-center`}>{disc.user_phone}</td>
                        <td className="text-center">{disc.shop_name}</td>
                        {!disc.isUsed && (
                          <td className="text-center">
                            <button
                              onClick={() => cancelDisc(disc.id)}
                              className="text-danger fw-bold w-100"
                            >
                              {key("cancelCode")}
                            </button>
                          </td>
                        )}
                      </tr>
                    )
                )}
              </tbody>
            </Table>

            <div className={styles.show_small_screens}>
              <Row>
                {filteredDisc.map(
                  (disc) =>
                    (usedData ? disc.isUsed : !disc.isUsed) && (
                      <Col
                        xs={12}
                        key={disc.id}
                        onClick={() =>
                          handleCheckboxChange(disc.id, disc.isUsed)
                        }
                      >
                        <div
                          className={`${styles.user_div} ${
                            selectedIds.includes(disc.id)
                              ? styles.blue_border
                              : ""
                          }`}
                          style={{ cursor: "pointer" }}
                        >
                          <ul className="p-0 mt-4">
                            <li className={styles.details_list}>
                              {key("orderNumber")}:{" "}
                              {disc.order_number ? disc.order_number : "-"}
                            </li>
                            <li className={styles.details_list}>
                              {key("name")}: {disc.user_name}
                            </li>
                            <li className={styles.details_list}>
                              {key("myPhone")}: {disc.user_phone}
                            </li>
                            <li className={styles.details_list}>
                              {key("store")}: {disc.shop_name}
                            </li>
                          </ul>
                          {disc.isUsed === false && (
                            <div className="text-end d-flex justify-content-end flex-wrap align-items-center">
                              <MainButton
                                onClick={() => cancelDisc(disc.id)}
                                text={key("cancelCode")}
                              />
                            </div>
                          )}
                        </div>
                      </Col>
                    )
                )}
              </Row>
            </div>
          </>
        ) : (
          <NoDataPage text={`${key("noDisc")}`} />
        )
      ) : (
        <LoadingOne />
      )}
    </div>
  );
};

export default Discounts;
