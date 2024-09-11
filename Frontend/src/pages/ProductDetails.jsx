// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const url = import.meta.env.VITE_APP_URL;

function ProductDetails() {
  const [product, setProduct] = useState(null);
  const { productId } = useParams();
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  const userId = user.userId;
  const admin = user.admin;

  console.log(admin);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${url}dashboard/products/${productId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch product");
      }
      const data = await res.json();
      setProduct(data.product);
      console.log(data.product);
    } catch (error) {
      console.error("Read selected product failed", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  return (
    <>
      <div>
        <h2>Product Details</h2>
        {product === null ? (
          <p>Loading...</p>
        ) : (
          <>
          <h3>{product.title}</h3>
          <ul>
            <li key={product._id}>
                {product.title} - {product.desc} - Expiration Date:{" "}
                {new Date(product.exp_date).toLocaleDateString()}
                <Link to={`/dashboard/products/edit/${product._id}`}>Edit</Link>
            </li>
          </ul>
          </>
        )}
      </div>
      <Link to={`/${userId}/add-product`}>Add a product</Link>
      <br />
      <Link to={`/dashboard/${userId}`}>Back to dashboard</Link>
    </>
  );
}

export default ProductDetails;