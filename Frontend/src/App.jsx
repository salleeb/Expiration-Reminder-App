// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { ReactNotifications } from "react-notifications-component";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import SearchBar from "./components/SearchBar";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Homepage from "./pages/Homepage";
import EditUser from "./pages/EditUser";
import EditProduct from "./pages/EditProduct";
import AddProduct from "./pages/AddProduct";
import AllUsers from "./pages/AllUsers";
import AllProducts from "./pages/AllProducts";
import Product from "./pages/Product";
import ProductDetails from "./pages/ProductDetails";
import UserDetails from "./pages/UserDetails";
import { CategoriesProvider } from "./contexts/CategoriesContext";
import { TagsProvider } from "./contexts/TagsContext";

function App() {
  const [productSuggestion, setProductSuggestion] = useState([]);

  return (
    <BrowserRouter>
      <CategoriesProvider>
        <TagsProvider>
      <ReactNotifications />
      <SearchBar element={<SearchBar setProductSuggestion={setProductSuggestion} />}/>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="dashboard/:userId" element={<Dashboard productSuggestion={productSuggestion} />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route
          path="dashboard/products/:productId"
          element={<ProductDetails />}
        />
        <Route path="dashboard/admin/users/:userId" element={<UserDetails />} />
        <Route
          path="dashboard/admin/users/edit/:userId"
          element={<EditUser />}
        />
        <Route
          path="dashboard/products/edit/:productId"
          element={<EditProduct />}
        />
        <Route path=":userId/add-product" element={<AddProduct />} />
        <Route path="dashboard/:userId/users" element={<AllUsers />} />
        <Route path="dashboard/:userId/products" element={<AllProducts />} />
        <Route path="dashboard/:userId/my_products" element={<Product />} />
        <Route
          path="dashboard/admin/:userId/my_products"
          element={<Product />}
        />
        {/* <Route path='*' element={<NoPage />} /> */}
      </Routes>
      </TagsProvider>
      </CategoriesProvider>
    </BrowserRouter>
  );
}

export default App;
