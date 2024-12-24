import React from "react";
import { useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError();
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Oops!</h1>
      <p>{error?.message || "An unexpected error occurred."}</p>
    </div>
  );
};
