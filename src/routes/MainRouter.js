/**
 * @file MainRouter.js
 * @description Root routing entry point.  Renders the `RouterProvider` with the
 * application's pre-built `router` from `routes.js`.  Mounted once at the app
 * root in `App.js`.
 */
import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

/**
 * Bootstraps the client-side router.
 * @returns {JSX.Element} `<RouterProvider>` wrapping all application routes.
 */
const MainRouter = () => {
  return <RouterProvider router={router} />;
};

export default MainRouter;
