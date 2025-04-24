import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

const MainRouter = () => {
  return <RouterProvider router={router} />;
};

export default MainRouter;
