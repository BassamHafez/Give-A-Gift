import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  const token = JSON.parse(localStorage.getItem("token"));
  if (token) {
    return props.children;
  } else {
    return <Navigate to={"/login"} />;
  }
};

export default ProtectedRoute;
