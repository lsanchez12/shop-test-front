import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Error404 from "./pages/Error404";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/users";
import Products from "./pages/products";
import Orders from "./pages/orders";
import loader from "./routes/loader";
import loaderSession from "./routes/loaderSession";
import reportWebVitals from "./reportWebVitals";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <Error404 />,
    loader,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    loader: loaderSession,
  },
  {
    path: "/users",
    element: <Users />,
    loader: loaderSession,
  },
  {
    path: "/products",
    element: <Products />,
    loader: loaderSession,
  },
  {
    path: "/orders",
    element: <Orders />,
    loader: loaderSession,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CssBaseline />
    <RouterProvider router={router} />
  </React.StrictMode>
);
reportWebVitals();
