// eslint-disable-next-line no-unused-vars
import React from "react";
import { createOneProduct } from "../functions/api";
import { useState } from "react";
import { Link } from "react-router-dom";

function AddProduct() {
  // const navigate = useNavigate()
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

  const handleCreateOneProduct = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      console.error("Please add a title");
      return;
    }

    try {
      const res = await createOneProduct(userId, formData);

      localStorage.setItem("product", res.product);
      console.log("Product stored in local storage:", res.product);

      const product = res
      localStorage.setItem("product", JSON.stringify(product));
      console.log("Product stored in local storage:", product._id);

      console.log("Form data submitted:", res);
      setMessage("Product created successfully");
      console.log(message);
    } catch (error) {
      console.error("Register product error:", error);
    }
  };

  // const handleCreateOneProduct = async (e) => {
  //   e.preventDefault();

  //   if (!formData.title) {
  //     console.error("Please add a title");
  //     return;
  //   }

  //   try {
  //       await createOneProduct(userId, formData);

  //     console.log("Form data submitted:");
  //     setMessage("Product created successfully");
  //     console.log(message);
  //   } catch (error) {
  //     console.error("Register product error:", error);
  //   }
  // };

  return (
    <>
      <h2>Add a product</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleCreateOneProduct}>
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
