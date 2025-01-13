import React, { useEffect } from "react";
import styles from "./AdminPages.module.css";
import AddColor from "./Colors/AddColor";
import AddProColor from "./Colors/AddProColor";
import AllColors from "./Colors/AllColors";
import { getColors } from "../../../util/Http";
import { useQuery } from "@tanstack/react-query";
import AllProColors from "./Colors/AllProColors";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Colors = () => {
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

  const { data: Colors, refetch } = useQuery({
    queryKey: ["colors"],
    queryFn: () => getColors({ limit: Infinity }),
    staleTime: Infinity,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className={styles.main_body}>
        <div className={`${styles.configs_body} mb-4`}>
          <AddColor refetch={refetch} />
        </div>
        <div className={`${styles.configs_body} mb-4`}>
          <AddProColor refetch={refetch} />
        </div>
        <hr />
        <AllColors Colors={Colors?.data?.colors} refetch={refetch} />
        <AllProColors proColors={Colors?.data?.proColors} refetch={refetch} />
      </div>
    </>
  );
};

export default Colors;
