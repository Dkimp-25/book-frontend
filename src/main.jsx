import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import App from "./App";
import AvailableBooks from "./components/AvailableBooks";
import AddBookForm from "./components/AddBookForm";
import BuyBooks from "./components/BuyBooks";
import SellBooks from "./components/SellBooks";
import "./index.css";

const isLoggedIn = true; // Replace with actual login check logic

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Redirect root path to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Define login and signup routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes that require login */}
        <Route path="/app" element={isLoggedIn ? <App /> : <Navigate to="/login" />}>
          <Route index element={<AvailableBooks />} />
          <Route path="add" element={<AddBookForm />} />
          <Route path="buy" element={<BuyBooks />} />
          <Route path="sell" element={<SellBooks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
