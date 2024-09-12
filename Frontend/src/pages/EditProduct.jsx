// eslint-disable-next-line no-unused-vars
import React from "react";
import {
  readOneProduct,
  updateOneProduct,
  deleteOneProduct,
} from "../functions/api";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import trashBin from "@iconify-icons/akar-icons/trash-bin";

function EditProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  const userId = user.userId;
  const { productId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    exp_date: "",
  });

  useEffect(() => {
    genReadOneProduct();
  }, []);

  const genReadOneProduct = async () => {
    try {
      const res = await readOneProduct(productId);
      console.log("Fetched Product:", res);
      setProduct(res);
      setFormData({
        title: res.title || "",
        desc: res.desc || "",
        exp_date: res.exp_date || "",
      });
    } catch (error) {
      console.error("Failed to fetch one product", error);
    }
  };

  const handleUpdateOneProduct = async (e) => {
    e.preventDefault();

    const isConfirmed = window.confirm("Are you sure you want to save these changes?");

    if (!isConfirmed) {
      return;
    }

    try {
      await updateOneProduct(productId, formData);
      console.log("Form data submitted:", formData);
      setMessage("Changes saved successfully!");
      navigate(`/dashboard/products/${productId}`);
    } catch (error) {
      console.error("Failed to fetch one products", error);
      setMessage("Failed to save changes.");
    }
  };

  const handleDeleteProduct = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this product permanently?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const product = localStorage.getItem("product");
      const res = await deleteOneProduct(productId, product);
      localStorage.removeItem("product");
      navigate(`/dashboard/${userId}/products`);
      setMessage("Product deleted successfully");
      console.log("Deletion was successful:", res.data);
    } catch (error) {
      console.error("Deletion failed:", error);
    }
  };

  return (
    <div>
      <h1>Edit Product</h1>
      {message && <p>{message}</p>}
      {product ? (
        <>
          <form onSubmit={handleUpdateOneProduct}>
            <label>
              Title:
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                value={formData.desc}
                onChange={(e) =>
                  setFormData({ ...formData, desc: e.target.value })
                }
              />
            </label>
            <label>
              Expiration date:
              <input
                type="date"
                value={formData.exp_date}
                onChange={(e) =>
                  setFormData({ ...formData, exp_date: e.target.value })
                }
              />
            </label>
            <button type="submit">Save Changes</button>
          </form>
          <button onClick={handleDeleteProduct}>
            <Icon icon={trashBin} width="24" height="24" />
          </button>
        </>
      ) : (
        <p>There is no product data...</p>
      )}
      <br />
      <Link className="return-arrow" to={`/dashboard/products/${productId}`}>
        &lt;
      </Link>
      <br />
      <Link to={`/dashboard/${userId}`}>Back to dashboard</Link>
    </div>
  );
}

export default EditProduct;
