// eslint-disable-next-line no-unused-vars
import React from 'react';
import { readOneProduct } from "../functions/api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ProductDetails() {
  const [product, setProduct] = useState(null);
  const { productId } = useParams();
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  const userId = user.userId;
  const admin = user.admin;

  console.log(admin);

  useEffect(() => {
    genReadOneProduct();
  }, [productId]);


  const genReadOneProduct = async () => {
    try {
      const res = await readOneProduct(productId);
      console.log("Fetched Product:", res);
      setProduct(res);
    } catch (error) {
      console.error("Failed to fetch one product", error);
    }
  };

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
                {new Date(product.exp_date).toLocaleDateString()} - Category: {product.category}
                - Tags: {product.tags}
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