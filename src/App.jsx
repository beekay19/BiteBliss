/* eslint-disable no-unused-vars */
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/signUp";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import PrivateRoute from "./assets/components/PrivateRoute";
import ForgotPassword from "./pages/Forgotpassword";
import Header from "./assets/components/Header";
import Category from "./pages/Category";
import SingleListing from "./pages/SingleListing";
import CreateFoodListings from "./pages/CreateFoodListings";
import { DataProvider } from "./contextProvider/DataContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <DataProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/category/:categoryName/:id"
              element={<SingleListing />}
            />
            <Route
              path="/Createfoodlistings"
              element={<CreateFoodListings />}
            />
            <Route path="/category/:categoryName" element={<Category />} />
            <Route path="/dashboard" element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </Router>
        <ToastContainer />
      </DataProvider>
    </>
  );
}

export default App;
