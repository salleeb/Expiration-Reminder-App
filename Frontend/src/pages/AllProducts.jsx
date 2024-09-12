// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { readAllProducts } from "../functions/api";

function AllProducts() {
  const [allProducts, setAllProducts] = useState(null);
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  const userId = user.userId;

  useEffect(() => {
    genReadAllProducts();
  }, []);

  const genReadAllProducts = async () => {
    try {
      const res = await readAllProducts();
      console.log("Fetched Products:", res);
      setAllProducts(res || []);
    } catch (error) {
      console.error("Failed to fetch all products", error);
    }
  };

  return (
    <>
      <div>
        <h2>All Products</h2>
        {allProducts === null ? (
          <p>Loading...</p>
        ) : allProducts.length === 0 ? (
          <p>There are no products...</p>
        ) : (
          allProducts.map((product) => (
            <ul key={product._id}>
              <li>
                <Link to={`/dashboard/products/${product._id}`}>
                  {product.title} - {product.desc} - Expiration Date:{" "}
                  {new Date(product.exp_date).toLocaleDateString()}
                </Link>
              </li>
            </ul>
          ))
        )}
      </div>
      <Link to={`/${userId}/add-product`}>Add a product</Link>
      <br />
      <Link to={`/dashboard/${userId}`}>Return to Dashboard</Link>
    </>
  );
}

export default AllProducts;
