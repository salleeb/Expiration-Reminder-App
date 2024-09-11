// eslint-disable-next-line no-unused-vars
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const url = import.meta.env.VITE_APP_URL;

function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [allProducts, setAllProducts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allUserProducts, setAllUserProducts] = useState([]);
  const [product, setProduct] = useState("");
  const [user, setUser] = useState("");
  const [userProduct, setUserProduct] = useState("");
  const [productSuggestion, setProductSuggestion] = useState([]);
  const [userSuggestion, setUserSuggestion] = useState([]);
  const [userProductSuggestion, setUserProductSuggestion] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const storedUser = localStorage.getItem("user");
  const currentUser = JSON.parse(storedUser);

  useEffect(() => {
    if (storedUser) {
      setCurrentUserIsAdmin(currentUser.admin);
      setCurrentUserId(currentUser.userId);
      console.log(currentUser);
      console.log(currentUserIsAdmin);
      console.log(currentUserId);
    }
  }, [currentUserId, currentUser]);

  useEffect(() => {
    if (currentUserIsAdmin) {
      fetchAllProducts();
      fetchAllUsers();
    } else {
      fetchUserProducts();
    }
  }, [currentUserIsAdmin]);

  useEffect(() => {
    const getDataAfterTimeout = setTimeout(() => {
      const fetchProductSuggestion = () => {
        const keyword = product.toLowerCase();
        const filtered = allProducts.filter((entry) => {
          return (
            (entry.title &&
              typeof entry.title === "string" &&
              entry.title.toLowerCase().includes(keyword)) ||
            (entry.desc &&
              typeof entry.desc === "string" &&
              entry.desc.toLowerCase().includes(keyword)) ||
            (entry.exp_date &&
              typeof entry.exp_date === "string" &&
              entry.exp_date.toLowerCase().includes(keyword))
          );
        });
        setProductSuggestion(filtered);
      };
      if (!clicked && product.length > 2) {
        fetchProductSuggestion();
      } else {
        setProductSuggestion([]);
        setClicked(false);
      }

      const fetchUserSuggestion = () => {
        const keyword = user.toLowerCase();
        const filtered = allUsers.filter((entry) => {
          return (
            (entry.name &&
              typeof entry.name === "string" &&
              entry.name.toLowerCase().includes(keyword)) ||
            (entry.email &&
              typeof entry.email === "string" &&
              entry.email.toLowerCase().includes(keyword))
          );
        });
        setUserSuggestion(filtered);
        console.log(userSuggestion);
      };
      if (!clicked && user.length > 2) {
        fetchUserSuggestion();
      } else {
        setUserSuggestion([]);
        setClicked(false);
      }

      const fetchUserProductSuggestion = () => {
        const keyword = userProduct.toLowerCase();
        const filtered = allUserProducts.filter((entry) => {
          return (
            (entry.title &&
              typeof entry.title === "string" &&
              entry.title.toLowerCase().includes(keyword)) ||
            (entry.desc &&
              typeof entry.desc === "string" &&
              entry.desc.toLowerCase().includes(keyword)) ||
            (entry.exp_date &&
              typeof entry.exp_date === "string" &&
              entry.exp_date.toLowerCase().includes(keyword))
          );
        });
        setUserProductSuggestion(filtered);
        console.log(userSuggestion);
      };
      if (!clicked && userProduct.length > 2) {
        fetchUserProductSuggestion();
      } else {
        setUserProductSuggestion([]);
        setClicked(false);
      }
    }, 100);

    return () => clearTimeout(getDataAfterTimeout);
  }, [product, user, userProduct]);

  useEffect(() => {
    setProduct("");
    setUser("");
    setUserProduct("");
  }, [location.pathname]);

  const fetchAllProducts = async () => {
    try {
      const res = await fetch(`${url}dashboard/admin/products`);
      if (!res.ok) {
        throw new Error("Failed to fetch all products");
      }
      const data = await res.json();
      setAllProducts(data.products || []);
    } catch (error) {
      console.error("Read all products failed", error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await fetch(`${url}dashboard/admin/users`);
      if (!res.ok) {
        throw new Error("Failed to fetch all users");
      }
      const data = await res.json();
      setAllUsers(data.users || []);
      console.log(allUsers);
    } catch (error) {
      console.error("Read all users failed", error);
    }
  };

  const fetchUserProducts = async () => {
    try {
      const res = await fetch(`${url}dashboard/${currentUserId}/my_products`);
      if (!res.ok) {
        throw new Error("Failed to fetch all products");
      }
      const data = await res.json();
      setAllUserProducts(data.products || []);
    } catch (error) {
      console.error("Read all products failed", error);
    }
  };

  const handleClick = (clicked) => {
    setProduct("");
    setUser("");
    setUserProduct("");

    if (clicked.title) {
      console.log("Product clicked:", clicked.title + " id :" + clicked._id);
      setClicked(true);
      navigate(`/dashboard/products/${clicked._id}`);
    } else if (clicked.name) {
      console.log("User clicked:", clicked.name + " id :" + clicked._id);
      setClicked(true);
      navigate(`/dashboard/admin/users/${clicked._id}`);
    } else {
      console.error("Clicked item is neither a product nor a user:", clicked);
    }
  };

  return (
    <>
      {storedUser && (
        <div>
          {currentUserIsAdmin ? (
            <>
              <input
                type="text"
                placeholder="Search..."
                value={product || user}
                onChange={(event) => {
                  const value = event.target.value;
                  setProduct(value);
                  setUser(value);
                }}
              />
              {productSuggestion.length > 0 || userSuggestion.length > 0 ? (
                <div className="suggestion">
                  <ul>
                    {productSuggestion.length > 0 &&
                      productSuggestion.map((currentProduct) => (
                        <li
                          key={currentProduct._id}
                          onClick={() => handleClick(currentProduct)}
                        >
                          {currentProduct.title} - {currentProduct.desc} -
                          Expiration Date:{" "}
                          {new Date(
                            currentProduct.exp_date
                          ).toLocaleDateString()}
                        </li>
                      ))}
                    {userSuggestion.length > 0 &&
                      userSuggestion.map((currentUser) => (
                        <li
                          key={currentUser._id}
                          onClick={() => handleClick(currentUser)}
                        >
                          {currentUser.name} - {currentUser.email}
                        </li>
                      ))}
                  </ul>
                </div>
              ) : (
                productSuggestion.length === 0 &&
                userSuggestion.length === 0 &&
                (product.length > 2 || user.length > 2) && (
                  <div className="no-results">Not found...</div>
                )
              )}
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Search..."
                value={userProduct}
                onChange={(event) => setUserProduct(event.target.value)}
              />
              {userProductSuggestion.length > 0 ? (
                <div className="suggestion">
                  <ul>
                    {userProductSuggestion.map((currentUserProduct) => (
                      <li
                        key={currentUserProduct._id}
                        onClick={() => handleClick(currentUserProduct)}
                      >
                        {currentUserProduct.title} - {currentUserProduct.desc} -
                        Expiration Date:{" "}
                        {new Date(
                          currentUserProduct.exp_date
                        ).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                userProductSuggestion.length === 0 &&
                userProduct.length > 2 && (
                  <div className="no-results">Not found...</div>
                )
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}

export default SearchBar;
