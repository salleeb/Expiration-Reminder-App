// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Dashboard({ productSuggestion }) {
  const location = useLocation();
  const filteredProducts =
    location.state?.filteredProducts || productSuggestion;
  const [isAdmin, setIsAdmin] = useState(false);
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  const userId = user.userId;

  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      const user = JSON.parse(storedUserData);

      if (user.admin === true) {
        setIsAdmin(user);
      }
    } else {
      console.error("No user data found in localStorage");
    }
  }, []);  

  return (
    <>
      <br />
      {isAdmin ? (
        <>
          <Link to={`/dashboard/admin/${userId}/my_products`}>My products</Link>
          <br />
          <Link to={`/dashboard/${userId}/products`}>All products</Link>
          <br />
          <Link to={`/dashboard/${userId}/users`}>All users</Link>
  
          {filteredProducts.length > 0 ? (
            <div>
              <ul>
                {filteredProducts.map((product) => (
                  <li key={product._id}>
                    {product.title} - {product.desc} - Expiration Date:{" "}
                    {new Date(product.exp_date).toLocaleDateString()} - Category:{" "}
                    {product.category} - Tags: {product.tags.join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="no-results">Not found...</div>
          )}
        </>
      ) : (
        <>
          <Link to={`/dashboard/${userId}/my_products`}>My products</Link>
          <br />
          <Link to={`/${userId}/add-product`}>Add a product</Link>
  
          <div>
            {filteredProducts.length > 0 ? (
              <div>
                <ul>
                  {filteredProducts.map((product) => (
                    <li key={product._id}>
                      {product.title} - {product.desc} - Expiration Date:{" "}
                      {new Date(product.exp_date).toLocaleDateString()} - Category:{" "}
                      {product.category} - Tags: {product.tags.join(", ")}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="no-results">Not found...</div>
            )}
          </div>
        </>
      )}
    </>
  );
}

Dashboard.propTypes = {
  productSuggestion: PropTypes.node,
};

export default Dashboard;
