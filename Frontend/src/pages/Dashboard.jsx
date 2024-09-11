// eslint-disable-next-line no-unused-vars
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
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
        // console.log(isAdmin);
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
        </>
      ) : (
        <>
          <Link to={`/dashboard/${userId}/my_products`}>My products</Link>
          <br />
          <Link to={`/${userId}/add-product`}>Add a product</Link>
        </>
      )}
    </>
  );
}

export default Dashboard;
