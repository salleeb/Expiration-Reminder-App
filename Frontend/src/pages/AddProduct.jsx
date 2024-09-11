// eslint-disable-next-line no-unused-vars
import React from 'react';
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

const url = import.meta.env.VITE_APP_URL;

function AddProduct() {
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  const userId = user.userId;
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    exp_date: undefined,
    img: "",
    tags: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegisterProduct = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      console.error("Please add a title");
      return;
    }

    try {
      await axios.post(`${url}${userId}/add-product`, formData);
      console.log(formData);
      setMessage("Product created successfully");
      console.log(message);
    } catch (error) {
      console.error("Register product error:", error);
    }
  };

  return (
    <>
      <h2>Add a product</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleRegisterProduct}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title || ""}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="desc"
          placeholder="Description..."
          value={formData.desc || ""}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="exp_date"
          placeholder="Expiration date"
          value={formData.exp_date || ""}
          onChange={handleInputChange}
        />
        {/* <input
            type="text"
            name="img"
            value={formData.img || ""}
            onChange={handleInputChange}
          /> */}
        <button type="submit">Register</button>
      </form>
      <Link to={`/dashboard/${userId}`}>Return to Dashboard</Link>
    </>
  );
}

export default AddProduct;
