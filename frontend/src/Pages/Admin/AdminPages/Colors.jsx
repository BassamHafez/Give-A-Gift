import React from "react";
import styles from "./AdminPages.module.css";
import { Toaster } from "react-hot-toast";
import AddColor from "./Colors/AddColor";
import AddProColor from "./Colors/AddProColor";
import AllColors from "./Colors/AllColors";
import { getColors } from "../../../util/Http";
import { useQuery } from "@tanstack/react-query";
import AllProColors from "./Colors/AllProColors";

const Colors = () => {

  const { data: Colors, refetch } = useQuery({
    queryKey: ["colors"],
    queryFn: getColors,
    staleTime: Infinity,
  });

  return (
    <>
      <Toaster position="top-right" />
      <div className={styles.main_body}>
        <div className={`${styles.configs_body} mb-2`}>
          <AddColor refetch={refetch} />
        </div>
        <div className={`${styles.configs_body} mb-2`}>
          <AddProColor refetch={refetch}/>
        </div>
        <hr />
        <AllColors Colors={Colors?.data?.colors} refetch={refetch}/>
        <AllProColors proColors={Colors?.data?.proColors} refetch={refetch}/>
      </div>
    </>
  );
};

export default Colors;
