import React from 'react';
import axios from "axios";
import {  useState } from "react";
import { useParams, Link } from "react-router-dom";

const url = import.meta.env.VITE_APP_URL;

function AddProduct() {
//  const { state } = props.location;
//  const { currentUserId } = state;
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    exp_date: undefined,
    img: "",
    tags: [],
  });

  const { currentUserId } = useParams();
  console.log(currentUserId);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      console.error("Please add a title");
      return;
    }
    try {
      await axios.post(`${url}${currentUserId}/add-product`, formData);
      console.log(formData);
    } catch (error) {
      console.error("Register product error:", error);
    }
  };

  return (
    <>
      <h2>Add a product</h2>
      <form onSubmit={handleRegister}>
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
        <Link to={`/dashboard/${currentUserId}`}>Back to Dashboard</Link>
    </>
  );
}

export default AddProduct;