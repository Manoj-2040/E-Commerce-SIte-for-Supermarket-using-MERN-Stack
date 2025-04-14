import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import Admin from "./pages/Admin";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/product/:id' element={<ProductDetail />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/sign-in/*' element={<SignInPage />} />
        <Route path='/sign-up/*' element={<SignUpPage />} />
        <Route path='/profile/*' element={<Profile />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
